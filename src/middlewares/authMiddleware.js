const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendErrorResponse } = require("../utils/failure");
const { sendSuccessResponse } = require("../utils/success");
const User = require("../models/UserModel");
const config = require("../config/config");

const checkAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[ 1 ];

      //decode token
      const decoded = jwt.verify(token, config.jwt.secret);

      const userData = await User.findById(decoded.id).select("-password");
      if (userData.status === 'inactive') {
        return sendErrorResponse(httpStatus.UNAUTHORIZED, res, "User is not active!")
      }
      req.user = userData
      next();
    } catch (error) {
      console.error(error);
      sendErrorResponse(
        httpStatus.UNAUTHORIZED,
        res,
        "Not authorized, token failed!"
      );
    }
  }

  if (!token) {
    sendErrorResponse(
      httpStatus.UNAUTHORIZED,
      res,
      "Not authorized, no token found."
    );
  }
});

module.exports = checkAuth;
