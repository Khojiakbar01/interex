const AppError = require("../../core/utils/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err.errors,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err.errors
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "dev") {
    console.log(err)
    console.log(err.stack)
    if (err.message === "Validatsiya xatosi") {
      err.message = err.errors.errors.map((er) => er.msg)
   }
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      if (err.message === "SequelizeDatabaseError") {
        if (err.original.code === "22P02") {
          err.message = new AppError("O'tkazish xatosi", 400);
        }
      }

      if (err.message === "Validatsiya xatosi") {
         err.message = err.errors.errors.map((er) => er.msg)
      }
      sendErrorProd(err, res);
    }
  }
};

module.exports = errorController;