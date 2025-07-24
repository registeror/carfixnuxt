import express from 'express';
import Category from '../models/Category.js';
import rateLimit from 'express-rate-limit';
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
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>|[\<\>\"\'\`\;\(\)\&\$\%\#\@\*\+\=\\\/\|\{\}\[\]]/g, '');
};

const validateCategoryInput = (req, res, next) => {
  try {
    if (req.body['categories-name']) {
      req.body['categories-name'] = sanitizeInput(req.body['categories-name']);
      
      // Проверка на пустое название после очистки
      if (!req.body['categories-name'].trim()) {
        return res.status(400).json({ message: 'Название категории не может быть пустым' });
      }
      
      // Проверка длины названия
      if (req.body['categories-name'].length > 50) {
        return res.status(400).json({ message: 'Название категории слишком длинное' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ message: 'Некорректные данные' });
  }
};

// Получить все категории
router.get('/', validateCategoryInput,  async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error });
  }
});

// Добавить новую категорию
router.post('/', validateCategoryInput, authMiddleware, async (req, res) => {
  const { 'categories-name': categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: 'Название категории обязательно' });
  }

  try {
    const newCategory = new Category({ 'categories-name': categoryName });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении категории', error });
  }
});

// Удалить категорию
router.delete('/:id', validateCategoryInput, authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.json({ message: 'Категория успешно удалена', deletedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении категории', error });
  }
});

export default router;