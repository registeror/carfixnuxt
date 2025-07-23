import express from 'express';
import Promocode from '../models/Promocode.js';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>|[\<\>\"\'\`\;\:\~\!\^\(\)\&\$\%\#\@\*\+\№\-\?\_\,\.\=\\\/\|\{\}\[\]]/g, '');
};

const validatePromocodeInput = (req, res, next) => {
  try {
    if (req.body['promocode-name']) {
      req.body['promocode-name'] = sanitizeInput(req.body['promocode-name']);
      
      // Проверка на пустое название после очистки
      if (!req.body['promocode-name'].trim()) {
        return res.status(400).json({ message: 'Название промокода не может быть пустым' });
      }
      
      // Проверка длины названия
      if (req.body['promocode-name'].length > 20) {
        return res.status(400).json({ message: 'Название промокода слишком длинное' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ message: 'Некорректные данные' });
  }
};

// Лимит: 100 запросов в минуту
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,
  message: 'Слишком много запросов. Попробуйте позже.',
  skip: (req) => {
    // Пропускаем лимит для админов
    return req.user?.role === 'sAdmin';
  }
});
router.use(limiter);

// Получить все промокоды
router.get('/', validatePromocodeInput, authMiddleware, async (req, res) => {
  try {
    const promocodes = await Promocode.find().lean();
    
    const decryptedPromocodes = await Promise.all(
      promocodes.map(async promo => {
        try {
          const promocode = new Promocode(promo);
          if (promocode.encrypted) {
            await promocode.decryptName();
          }
          return promocode.toObject();
        } catch (error) {
          console.error(`Ошибка обработки промокода ${promo._id}:`, error);
          return promo; 
        }
      })
    );

    res.json(decryptedPromocodes);
  } catch (error) {
    console.error('Ошибка при получении промокодов:', error);
    res.status(500).json({ 
      message: 'Ошибка при получении промокодов',
      error: error.message 
    });
  }
});

// Создать новый промокод
router.post('/', validatePromocodeInput, authMiddleware, async (req, res) => {
  const { 'promocode-name': name, 'promocode-active': active, 'promocode-discount': discount } = req.body;

  // Валидация данных
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Неверное название промокода' });
  }

  if (typeof active !== 'number' || active < 0) {
    return res.status(400).json({ message: 'Неверное количество активаций' });
  }

  if (typeof discount !== 'number' || discount < 1 || discount > 100) {
    return res.status(400).json({ message: 'Скидка должна быть от 1 до 100%' });
  }

  try {
    const newPromocode = new Promocode({
      'promocode-name': name.trim(),
      'promocode-active': active,
      'promocode-discount': discount,
      encrypted: false
    });

    const savedPromocode = await newPromocode.save();
    
    // Дешифруем для ответа
    await savedPromocode.decryptName();
    
    res.status(201).json(savedPromocode);
  } catch (error) {
    console.error('Ошибка при создании промокода:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Промокод с таким названием уже существует' 
      });
    }
    
    res.status(400).json({ 
      message: 'Ошибка при создании промокода',
      error: error.message 
    });
  }
});


// Удалить промокод
router.delete('/:id', validatePromocodeInput, async (req, res) => {
  try {
    const deletedPromocode = await Promocode.findByIdAndDelete(req.params.id);
    if (!deletedPromocode) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }
    res.json({ message: 'Промокод удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить промокод
router.put('/:id', validatePromocodeInput, async (req, res) => {
  const { 'promocode-name': name, 'promocode-active': active, 'promocode-discount': discount } = req.body;

  try {
    // Находим и обновляем через save() для работы хуков
    const promocode = await Promocode.findById(req.params.id);
    if (!promocode) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }

    promocode['promocode-name'] = name;
    promocode['promocode-active'] = active;
    promocode['promocode-discount'] = discount;
    promocode.encrypted = false; // Помечаем для повторного шифрования

    const updatedPromocode = await promocode.save();
    res.json(updatedPromocode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/activate', async (req, res) => {
  const { promo } = req.body;
  
  try {
    const promocode = await Promocode.findById(req.params.id);
    if (!promocode) return res.status(404).json({ message: 'Промокод не найден' });
    
    if (!promocode.validatePromocode(promo)) {
      return res.status(400).json({ message: 'Неверный промокод' });
    }
    
    res.json({ success: true, discount: promocode['promocode-discount'] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Метод для проверки промокода
router.post('/validate', async (req, res) => {
  const { promocode } = req.body;
  
  if (!promocode || typeof promocode !== 'string') {
    return res.status(400).json({ 
      valid: false,
      message: 'Промокод обязателен'
    });
  }

  try {
    // Находим все промокоды (так как имя зашифровано)
    const allPromocodes = await Promocode.find().lean();
    
    let validPromo = null;
    
    // Дешифруем и проверяем каждый промокод
    for (const promo of allPromocodes) {
      const promocodeObj = new Promocode(promo);
      if (promocodeObj.encrypted) {
        await promocodeObj.decryptName();
      }
      
      if (promocodeObj['promocode-name'] === promocode.trim()) {
        validPromo = promocodeObj;
        break;
      }
    }

    if (!validPromo) {
      return res.json({ 
        valid: false,
        message: 'Промокод не найден'
      });
    }

    if (validPromo['promocode-active'] <= 0) {
      return res.json({ 
        valid: false,
        message: 'Промокод больше не активен'
      });
    }

    res.json({
      valid: true,
      discount: validPromo['promocode-discount'],
      message: `Промокод применен! Скидка ${validPromo['promocode-discount']}%`
    });
  } catch (error) {
    console.error('Ошибка при проверке промокода:', error);
    res.status(500).json({ 
      valid: false,
      message: 'Ошибка при проверке промокода'
    });
  }
});

export default router;