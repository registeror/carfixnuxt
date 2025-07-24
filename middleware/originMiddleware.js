const originMiddleware = (req, res, next) => {
  const allowedOrigins = ['https://localhost:3000']; // Ваш фронтенд
  const origin = req.headers.origin || req.headers.referer;

  // Пропускаем OPTIONS-запросы (для CORS)
  if (req.method === 'OPTIONS') return next();

  // Проверяем Origin/Referer
  if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }
  
  next();
};
export default originMiddleware;