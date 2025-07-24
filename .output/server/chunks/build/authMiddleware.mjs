import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Токен истек" });
    }
    return res.status(401).json({ message: "Недействительный токен" });
  }
};

export { authMiddleware as default };
//# sourceMappingURL=authMiddleware.mjs.map
