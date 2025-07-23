const ecFetchMiddleware = (req, res, next) => {
  // Разрешаем запросы только с заголовком 'Sec-Fetch-Mode: cors' (отправляется браузером при fetch/axios)
  if (req.headers['sec-fetch-mode'] !== 'cors') {
    return res.status(403).json({ error: 'Доступ запрещен' });
  }
  next();
};
export default ecFetchMiddleware;