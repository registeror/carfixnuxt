const ecFetchMiddleware = (req, res, next) => {
  if (req.headers["sec-fetch-mode"] !== "cors") {
    return res.status(403).json({ error: "Доступ запрещен" });
  }
  next();
};

export { ecFetchMiddleware as default };
//# sourceMappingURL=secFetchMiddleware.mjs.map
