const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  client_url: process.env.CLIENT_URL,
  mongoose: {
    db_url: process.env.MONGODB_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationDays: process.env.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    masterPassword: process.env.MASTER_PASSWORD,
  },
};
