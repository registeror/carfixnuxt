// middleware/csrfMiddleware.js
const csrfMiddleware = (req, res, next) => {
  // Пропускаем GET, HEAD, OPTIONS запросы (они не изменяют состояние)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Получаем токен из куки и заголовка
  const csrfCookie = req.cookies.csrf;
  const csrfHeader = req.headers['x-xsrf-token'];

  // Проверяем наличие и совпадение токенов
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ 
      success: false, 
      message: 'Недействительный CSRF-токен' 
    });
  }

  next();
};

export default csrfMiddleware;