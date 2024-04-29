const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendSuccessResponse } = require("../../utils/success");
const { sendErrorResponse } = require("../../utils/failure");
const { generateToken, generateJwtTokens } = require("../../config/generateToken");
const User = require("../../models/UserModel");



const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user)
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found");
  if (!(await user.matchPassword(password))) {
    return sendErrorResponse(
      httpStatus.UNAUTHORIZED,
      res,
      "Incorrect email or password!"
    );
  }
  if (user.status === 'inactive') {
    return sendErrorResponse(httpStatus.UNAUTHORIZED, res, "User is not active!")
  }
  //jwt flow
  const jwtClaim = {
    id: user._id
  }
  const { accessToken, refreshToken } = await generateJwtTokens(jwtClaim)

  user = JSON.parse(JSON.stringify(user));
  const response = {
    ...user,
    accessToken,
    refreshToken,
  };
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User login successful!",
    response
  );
});



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error("Please enter all required fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists)
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "User already exists"
    );

  const userData = {
    name,
    email,
    password,
    pic,
  };
  let user = await User.create(userData);
  user = JSON.parse(JSON.stringify(user));
  const response = {
    ...user,
    token: generateToken(user._id),
  };
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User registered successfully!",
    response
  );
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  const keywordFilter = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find(keywordFilter).find({
    _id: { $ne: req.user._id },
  });

  sendSuccessResponse(httpStatus.OK, res, "Users fetched successfully", users);
});

module.exports = {
  login,
  registerUser,
  fetchAllUsers,
};
