const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendSuccessResponse } = require("../../utils/success");
const { sendErrorResponse } = require("../../utils/failure");
const generateToken = require("../../config/generateToken");
const User = require("../../models/UserModel");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, account_type } = req.body;


  const userData = {
    name,
    email,
    password,
    account_type,
    status: "active",
  };
  let user = await User.create(userData);
  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User registered successfully!",
    user
  );
});
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, account_type, status } = req.body;

  //check if user exists
  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  const userData = {
    name,
    email,
    password,
    account_type,
    status,
  };

  Object.assign(user, userData)

  await user.save()
  // let user = await User.create(userData);
  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User updated successfully!",
    user
  );
});
const changeStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  //check if user exists
  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  const userData = {
    status,
  };

  Object.assign(user, userData)

  await user.save()
  // let user = await User.create(userData);
  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User updated successfully!",
    user
  );
});
const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }

  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User fetched successfully!",
    user
  );
});
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  await User.findByIdAndDelete(userId)
  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User deleted successfully!",
    user
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

  user = JSON.parse(JSON.stringify(user));
  const response = {
    ...user,
    token: generateToken(user._id),
  };
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User login successful!",
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
  createUser,
  updateUser,
  changeStatus,
  getUser,
  deleteUser,
  registerUser,
  login,
  fetchAllUsers,
};