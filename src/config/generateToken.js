const jwt = require("jsonwebtoken");
const config = require("./config");

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationDays}d`,
  });
};

module.exports = generateToken;
