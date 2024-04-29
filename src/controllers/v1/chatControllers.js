const asyncHandler = require("express-async-handler");
const Chat = require("../../models/ChatModel");
const User = require("../../models/UserModel");
const { sendSuccessResponse } = require("../../utils/success");
const httpStatus = require("http-status");
const { sendErrorResponse } = require("../../utils/failure");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User Id param not provided in request");
    return res.sendStatus(400);
  }

  let isChatExists = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChatExists = await User.populate(isChatExists, {
    path: "latestMessage.sender",
    select: "name email profilePic",
  });

  if (isChatExists) {
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Chat fetched successfully",
      isChatExists
    );
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const fullChatRes = await Chat.findById(createChat._id).populate(
        "users",
        "-password"
      );

      sendSuccessResponse(
        httpStatus.OK,
        res,
        "Chat fetched successfully",
        fullChatRes
      );
    } catch (error) {
      sendErrorResponse(httpStatus.BAD_REQUEST, res, error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let userChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    userChats = await User.populate(userChats, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "User's chats fetched successfully",
      userChats
    );
  } catch (error) {
    sendErrorResponse(httpStatus.BAD_REQUEST, res, error.message);
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "Please fill all the fields!"
    );
  }

  const { chatName, users } = req.body;
  if (users.length < 2) {
    return sendErrorResponse(
      httpStatus.BAD_REQUEST,
      res,
      "More then two users required to create a group chat"
    );
  }

  //add logged in user also
  users.push(req.user._id);

  try {
    const chatData = {
      isGroupChat: true,
      groupAdmin: req.user._id,
      chatName,
      users,
    };
    const groupChat = await Chat.create(chatData);

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Group chat created successfully.",
      fullGroupChat
    );
  } catch (error) {
    sendErrorResponse(httpStatus.BAD_REQUEST, res, error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updateBody = { chatName };
  const updatedChat = await Chat.findByIdAndUpdate(chatId, updateBody, {
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chat not found");
  } else {
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Chat updated successfully.",
      updatedChat
    );
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chat not found");
  } else {
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "User added to group successfully.",
      added
    );
  }
});
const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    return sendErrorResponse(httpStatus.NOT_FOUND, res, "Chat not found");
  } else {
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "User added to group successfully.",
      removed
    );
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
