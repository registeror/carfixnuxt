const originMiddleware = (req, res, next) => {
  const allowedOrigins = ["https://localhost:3000"];
  const origin = req.headers.origin || req.headers.referer;
  if (req.method === "OPTIONS") return next();
  if (!origin || !allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }
  next();
};

export { originMiddleware as default };
//# sourceMappingURL=originMiddleware.mjs.map
