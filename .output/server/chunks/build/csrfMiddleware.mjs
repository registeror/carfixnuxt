const csrfMiddleware = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }
  const csrfCookie = req.cookies.csrf;
  const csrfHeader = req.headers["x-xsrf-token"];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      success: false,
      message: "Недействительный CSRF-токен"
    });
  }
  next();
};

export { csrfMiddleware as default };
//# sourceMappingURL=csrfMiddleware.mjs.map
