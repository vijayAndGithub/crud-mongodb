const jwt = require("jsonwebtoken");
const config = require("./config");

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationDays}d`,
  });
};

const generateJwtTokens = async (JwtData) => {
  try {

    const accessToken = jwt.sign(JwtData, config.jwt.secret, { expiresIn: config.jwt.accessExpiration });
    const refreshToken = jwt.sign(JwtData, config.jwt.secret, { expiresIn: config.jwt.refreshExpiration });


    return {
      accessToken,
      refreshToken
    }

  } catch (error) {
    console.log('error generating token', error)
  }
}
module.exports = { generateToken, generateJwtTokens };
