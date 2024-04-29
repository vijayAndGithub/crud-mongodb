const httpStatus = require("http-status");
const config = require("../config/config");

const notFound = (req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  res.status(httpStatus.NOT_FOUND);
  next(err);
};

const badJSONHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const statusCode = httpStatus.BAD_REQUEST;
    console.log("Err => ", err, req.body);

    res.status(statusCode);
    throw new Error("Bad JSON format, please try again");
  } else {
    // Default to 500 if err.status is not a valid HTTP status code
    const statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    console.log("Err => ", err, req.body);
    res.status(statusCode);
    throw new Error(
      "Could not perform the action, please check for valid payload if any, try again"
    );
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode =
    res.statusCode === httpStatus.OK
      ? httpStatus.INTERNAL_SERVER_ERROR
      : res.statusCode;

  let { message, stack } = err;

  const response = {
    success: false,
    code: statusCode,
    message,
    stack: config.env === "development" ? null : stack,
  };

  res.status(statusCode).json(response);
};

module.exports = {
  badJSONHandler,
  notFound,
  errorHandler,
};
