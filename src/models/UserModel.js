const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { modelNames } = require("../config/dbConfig");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    account_type: { type: String, enum: [ 'admin', 'user' ], required: true },
    status: { type: String, enum: [ 'active', 'inactive' ], required: true },
    ViewAccess: { type: Boolean, required: true },
    CreateAccess: { type: Boolean, required: true },
    EditAccess: { type: Boolean, required: true },
    DeleteAccess: { type: Boolean, required: true },

  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  const user = this;
  return await bcrypt.compare(enteredPassword, user.password);
};

const User = mongoose.model(modelNames.User, UserSchema);

module.exports = User;
