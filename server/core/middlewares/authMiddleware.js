const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Registratsiyadan o'tilmagan", 401));
  }
  const token = authHeader.slice(7);

  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (!user) {
    return next(new AppError("Registratsiyadan o'tilmagan", 401));
  }
  req.user = user;
  next();
};

module.exports = authMiddleware;
