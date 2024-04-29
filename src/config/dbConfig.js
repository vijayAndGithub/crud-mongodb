const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoose.db_url);
    console.log(`Connected to Mongodb : ${conn.connection.host}`);
    mongoose.set("debug", true);
  } catch (error) {
    console.error(`error===> ${error.message}`);
    process.exit();
  }
};

const modelNames = {
  User: "User",
  Chat: "Chat",
  Message: "Message",
};

module.exports = {
  connectDB,
  modelNames,
};
