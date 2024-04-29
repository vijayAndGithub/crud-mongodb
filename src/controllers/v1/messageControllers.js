const asyncHandler = require("express-async-handler");
const Chat = require("../../models/ChatModel");
const User = require("../../models/UserModel");
const { sendSuccessResponse } = require("../../utils/success");
const httpStatus = require("http-status");
const { sendErrorResponse } = require("../../utils/failure");
const Message = require("../../models/MessageModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    console.log("Invalid data passed into request");
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const newMessageData = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let newMessage = await Message.create(newMessageData);
    newMessage = await newMessage.populate("sender", "name pic");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    //update this message as latest message of chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Message created successfully",
      newMessage
    );
  } catch (error) {
    sendErrorResponse(httpStatus.BAD_REQUEST, res, error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    sendSuccessResponse(
      httpStatus.OK,
      res,
      "Messages fetched successfully.",
      allMessages
    );
  } catch (error) {
    sendErrorResponse(httpStatus.BAD_REQUEST, res, error.message);
  }
});

module.exports = {
  sendMessage,
  allMessages,
};
