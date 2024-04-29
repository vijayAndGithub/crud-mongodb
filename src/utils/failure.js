module.exports = {
  defaultErrorMessage: "Failed! Something went wrong",
  sendErrorResponse: function (statusCode, res, message) {
    res.status(statusCode);
    throw new Error(message);
    /* res.status(statusCode).json({
      success: false,
      code: statusCode,
      message,
    }); */
  },
  sendServiceErrorObj: function (message, data = []) {
    return {
      success: false,
      message: message || "Something went wrong!",
      data,
    };
  },
};
