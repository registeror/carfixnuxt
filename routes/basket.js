import express from 'express';
import Basket from '../models/Basket.js';
import Promocode from '../models/Promocode.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
// Лимит: 100 запросов в минуту
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,
  skip: (req) => {
    // Пропускаем лимит для админов
    return req.user?.role === 'sAdmin';
  }
});
router.use(limiter);
// Добавить товар в корзину
router.post('/add', async (req, res) => {
  const { 
    userId, 
    'items-product-id': productId,
    'items-product-name': productName, 
    'items-quantity': quantity, 
    'items-price': price, 
    'items-product-image': image,
    'items-product-volume': volume,
    'items-has-volume': hasVolume,
    'items-promocode': promocode
  } = req.body;

  try {
    let discount = 0;
    if (promocode) {
      const promo = await Promocode.findOne({ 'promocode-name': promocode });
      if (promo && promo['promocode-active'] > 0) {
        discount = promo['promocode-discount'];
      }
    }

    let basket = await Basket.findOne({ userId });
    if (!basket) basket = new Basket({ userId, items: [] });

    const existingItemIndex = basket.items.findIndex(
      item => item['items-product-id'] === productId && 
             (hasVolume ? item['items-product-volume'] === volume : true)
    );

    if (existingItemIndex > -1) {
      basket.items[existingItemIndex]['items-quantity'] += quantity;
      if (promocode) {
        basket.items[existingItemIndex]['items-promocode'] = promocode;
        basket.items[existingItemIndex]['items-promocode-discount'] = discount;
      }
    } else {
      basket.items.push({
        'items-product-id': productId,
        'items-product-name': productName,
        'items-quantity': quantity,
        'items-price': price,
        'items-product-image': image,
        'items-product-volume': volume || '1шт',
        'items-has-volume': hasVolume,
        'items-promocode': promocode || null,
        'items-promocode-discount': discount || 0
      });
    }

    await basket.save();
    res.status(201).json(basket);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении товара в корзину', error });
  }
});

// Маршрут для проверки промокода
router.post('/check-promocode', async (req, res) => {
    const { promocode } = req.body;
    
    try {
        const promo = await Promocode.findOne({ 'promocode-name': promocode });
        if (!promo) {
            return res.status(200).json({ valid: false, message: '' }); // Пустое сообщение для несуществующего промокода
        }
        
        if (promo['promocode-active'] <= 0) {
            return res.status(200).json({ valid: false, message: '' });
        }
        
        res.json({ 
            valid: true, 
            discount: promo['promocode-discount'],
            message: `-${promo['promocode-discount']}%`
        });
    } catch (error) {
        res.status(200).json({ valid: false, message: '' }); // Пустое сообщение при ошибке
    }
});

// Удалить товар из корзины
router.delete('/remove', async (req, res) => {
    const { 
        userId, 
        'items-product-id': productId,
        'items-product-volume': volume 
    } = req.body;

    try {
        const basket = await Basket.findOne({ userId });
        if (!basket) return res.status(404).json({ message: 'Корзина не найдена' });

        basket.items = basket.items.filter(item => 
            item['items-product-id'] !== productId || 
            (volume && item['items-product-volume'] !== volume)
        );
        
        await basket.save();
        res.json(basket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара', error });
    }
});

// Изменить количество товара в корзине
router.put('/update', async (req, res) => {
    const { 
        userId, 
        'items-product-id': productId, 
        'items-quantity': quantity,
        'items-product-volume': volume 
    } = req.body;

    try {
        const basket = await Basket.findOne({ userId });
        if (!basket) return res.status(404).json({ message: 'Корзина не найдена' });

        const itemIndex = basket.items.findIndex(item => 
            item['items-product-id'] === productId && 
            (volume ? item['items-product-volume'] === volume : true)
        );

        if (itemIndex > -1) {
            basket.items[itemIndex]['items-quantity'] = quantity;
            await basket.save();
            return res.json(basket);
        }
        res.status(404).json({ message: 'Товар не найден в корзине' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении количества', error });
    }
});

// Получить корзину пользователя
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const basket = await Basket.findOne({ userId });
        res.json(basket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении корзины', error });
    }
});

// Очистка корзины пользователя
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const basket = await Basket.findOne({ userId });
  
      if (!basket) {
        return res.status(404).json({ message: 'Корзина не найдена' });
      }
  
      basket.items = []; // Очищаем корзину
      await basket.save();
  
      res.json({ message: 'Корзина успешно очищена' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при очистке корзины', error });
    }
});

export default router;