module.exports = (err, req, res, next) => {
  console.log(err);
  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    err.statuscode = 400;
    err.message = err.errors[0].message;
  }

  if (err.name === 'TokenExpiredError') {
    err.statuscode = 401;
  }

  if (err.name === 'JsonWebTokenError') {
    err.statuscode = 401;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
