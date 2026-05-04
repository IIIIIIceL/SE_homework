function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? '服务异常' : err.message;

  return res.status(statusCode).json({
    code: err.code || 'INTERNAL_ERROR',
    message
  });
}

module.exports = errorHandler;