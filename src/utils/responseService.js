const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, error = null, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message || error : null,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
