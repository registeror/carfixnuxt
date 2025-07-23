import express from 'express';
import Product from '../models/Product.js';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\#\@\*\+\=\\\/\|\{\}\[\]]/g, '');
};
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
// Получить все товары
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении товаров', error });
    }
});

const validateProductInput = (req, res, next) => {
  try {
    // Проверяем и очищаем все текстовые поля
    if (req.body['product-name']) {
      req.body['product-name'] = sanitizeInput(req.body['product-name']);
    }
    
    if (req.body['product-description']) {
      req.body['product-description'] = sanitizeInput(req.body['product-description']);
    }
    
    if (req.body.items) {
      req.body.items = req.body.items.map(item => ({
        'product-volume': sanitizeInput(item['product-volume']),
        'product-price': item['product-price'] // Числовое поле, не требует очистки
      }));
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ message: 'Некорректные данные' });
  }
};

// Маршрут для поиска товаров по названию
router.get('/search/:query', async (req, res) => {
    const { query } = req.params;
  
    try {
      const products = await Product.find({
        'product-name': { $regex: query, $options: 'i' },
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при поиске товаров', error });
    }
});

// Получить товары по категории
router.get('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
  
    try {
      const products = await Product.find({ 'product-category': categoryId });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении товаров по категории', error });
    }
});

// Добавить новый товар
router.post('/', validateProductInput, authMiddleware, async (req, res) => {
    const { 
        'product-name': productName, 
        'product-description': productDescription, 
        'product-price': productPrice, 
        'product-has-volume': productHasVolume,
        items,
        'product-image': productImage, 
        'product-category': productCategory 
    } = req.body;

    // Валидация
    if (!productName || !productDescription || !productImage || !productCategory) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
        const productData = {
            'product-name': productName,
            'product-description': productDescription,
            'product-has-volume': productHasVolume,
            'product-image': productImage,
            'product-category': productCategory,
            items: productHasVolume 
                ? items 
                : [{ 
                    'product-volume': 'Стандарт', 
                    'product-price': Number(productPrice) 
                }]
        };

        const newProduct = new Product(productData);
        await newProduct.save();
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении товара', error: error.message });
    }
});

// Получить товар по ID
router.get('/:id', validateProductInput, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении товара', error });
    }
});

// Обновить товар по ID
router.put('/:id', validateProductInput, authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { 
    'product-name': productName, 
    'product-description': productDescription, 
    'product-price': productPrice, 
    'product-has-volume': productHasVolume,
    items,
    'product-image': productImage, 
    'product-category': productCategory 
  } = req.body;

  try {
    const updateData = {
      'product-name': productName,
      'product-description': productDescription,
      'product-has-volume': productHasVolume,
      'product-image': productImage,
      'product-category': productCategory,
    };

    // Для товаров с вариативностью
  if (productHasVolume) {
    updateData.items = items;
    updateData['product-price'] = null;
  } else {
    updateData['product-price'] = Number(productPrice);
    updateData.items = [{
      'product-volume': 'Стандарт',
      'product-price': Number(productPrice)
    }];
  }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении товара', error });
  }
});

// Удалить товар по ID
router.delete('/:id', validateProductInput, authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json({ message: 'Товар успешно удален', deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара', error });
    }
});

export default router;