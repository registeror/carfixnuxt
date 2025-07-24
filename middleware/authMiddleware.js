import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Получаем токен из cookies

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Проверяем токен
    req.user = decoded; // Добавляем информацию о пользователе в запрос
    next(); // Передаем управление следующему middleware или маршруту
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истек' });
    }
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

export default authMiddleware;