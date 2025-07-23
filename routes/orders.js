import express from 'express';
import Order from '../models/Order.js';
import Promocode from '../models/Promocode.js';
import { encryptData } from '../models/Encryption.js';
import rateLimit from 'express-rate-limit';
import { sendOrderEmail } from '../services/mailer.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
const validateOrderData = (req, res, next) => {
  const { 
    userId, 
    items, 
    'order-name': orderName, 
    'order-gmail': orderGmail, 
    'order-phone': orderPhone,
    'order-promocode': promocode
  } = req.body;

  // Проверка обязательных полей
  if (!userId || !items || !orderName || !orderGmail || !orderPhone) {
    return res.status(400).json({ 
      message: 'Все поля обязательны для заполнения' 
    });
  }

  // Валидация имени (только буквы и пробелы)
  if (!/^[a-zA-Zа-яА-Я\s]+$/.test(orderName)) {
    return res.status(400).json({ 
      message: 'Имя может содержать только буквы и пробелы' 
    });
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(orderGmail)) {
    return res.status(400).json({ 
      message: 'Неверный формат электронной почты' 
    });
  }

  // Валидация телефона (минимум 11 цифр)
  const phoneDigits = orderPhone.replace(/\D/g, '');
  if (phoneDigits.length < 11) {
    return res.status(400).json({ 
      message: 'Номер телефона должен содержать минимум 11 цифр' 
    });
  }

  // Валидация промокода (если есть)
  if (promocode && !/^[a-zA-Zа-яА-Я0-9\s]+$/.test(promocode)) {
    return res.status(400).json({ 
      message: 'Недопустимые символы в промокоде' 
    });
  }

  next();
};

// Создание нового заказа
router.post('/', validateOrderData, async (req, res) => {
  const { 
    userId, 
    items, 
    'order-name': orderName, 
    'order-gmail': orderGmail, 
    'order-phone': orderPhone,
    'order-promocode': promocode,
    'order-discount': discount
  } = req.body;

  try {
    // 1. Проверка и обработка промокода
    let promoToUpdate = null;
    if (promocode) {
      // Находим промокод с учетом шифрования
      const allPromocodes = await Promocode.find();
      
      for (const promo of allPromocodes) {
        const tempPromo = new Promocode(promo);
        if (tempPromo.encrypted) {
          await tempPromo.decryptName();
        }
        
        if (tempPromo['promocode-name'] === promocode.trim()) {
          promoToUpdate = tempPromo;
          break;
        }
      }

      if (!promoToUpdate) {
        return res.status(400).json({
          message: 'Неверный промокод'
        });
      }

      if (promoToUpdate['promocode-active'] <= 0) {
        return res.status(400).json({
          message: 'Промокод больше не активен'
        });
      }
    }

    // 2. Создаем заказ
    const newOrder = new Order({
      userId,
      items: items.map(item => ({
        ...item,
        'items-original-price': item['items-price'] * item['items-quantity'],
        'items-final-price': discount 
          ? (item['items-price'] * item['items-quantity']) * (1 - discount / 100)
          : item['items-price'] * item['items-quantity'],
        'items-promocode': promocode ? encryptData(promocode) : null, // Шифруем промокод для каждого товара
        'items-promocode-discount': discount || 0
      })),
      'order-name': orderName,
      'order-gmail': orderGmail,
      'order-phone': orderPhone,
      'order-status': 'Не готов',
      'order-promocode': promocode || null,
      'order-discount': discount || 0,
      encryptedPromo: !!promocode // Добавляем флаг шифрования
    });

    // 3. Сохраняем заказ
    const savedOrder = await newOrder.save();
if (savedOrder) {
  try {
    // Дешифруем данные перед отправкой
    const decryptedOrder = await savedOrder.decryptFields();
    
    // Добавляем промокод в данные для письма
    const orderForEmail = {
      ...decryptedOrder.toObject(),
      'order-promocode': promocode || null
    };
    
    await sendOrderEmail(orderForEmail);
  } catch (emailError) {
    console.error('Ошибка отправки email:', emailError);
  }
}
    // 4. Обновляем промокод (после успешного создания заказа)
    if (promoToUpdate) {
      promoToUpdate['promocode-active'] -= 1;
      
      if (promoToUpdate['promocode-active'] <= 0) {
        await Promocode.deleteOne({ _id: promoToUpdate._id });
      } else {
        // Шифруем обратно перед сохранением
        promoToUpdate.encrypted = false;
        await promoToUpdate.save();
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ошибка: заказ с таким ID уже существует',
        code: 'DUPLICATE_ORDER'
      });
    }
    
    res.status(500).json({ 
      message: 'Ошибка при создании заказа',
      error: error.message 
    });
  }
});

// Получение всех заказов
router.get('/',  async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderNumber: -1 });
    
    const decryptedOrders = await Promise.all(
      orders.map(async order => {
        try {
          const orderObj = order.toObject();
          if (orderObj.encrypted) {
            const { decryptData } = await import('../models/Encryption.js');
            
            // Проверяем каждое поле перед дешифровкой
            const fieldsToDecrypt = ['order-name', 'order-gmail', 'order-phone'];
            fieldsToDecrypt.forEach(field => {
              if (orderObj[field] && typeof orderObj[field] === 'string') {
                orderObj[field] = decryptData(orderObj[field]) || orderObj[field];
              }
            });
            
            orderObj.encrypted = false;
          }
          return orderObj;
        } catch (error) {
          console.error(`Ошибка дешифрования заказа ${order._id}:`, error);
          return order.toObject();
        }
      })
    );

    res.json(decryptedOrders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ 
      message: 'Ошибка при получении заказов',
      error: error.message 
    });
  }
});

// Обновление заказа (статус, товары)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 'order-status': orderStatus, items } = req.body;

  try {
    const statusToSet = orderStatus || 'В обработке';
    // Проверяем, что все товары имеют необходимые поля
    const validatedItems = items.map(item => ({
      ...item,
      'items-product-volume': item['items-product-volume'] || '1шт',
      'items-has-volume': item['items-has-volume'] || false
    }));

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 'order-status': orderStatus, items: validatedItems },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении заказа', error });
  }
});

// Удаление заказа
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);
    res.json({ message: 'Заказ успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении заказа', error });
  }
});

export default router;