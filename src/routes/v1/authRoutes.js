const express = require("express");
const userController = require("../../controllers/v1/userController");
const authController = require("../../controllers/v1/authController");
const checkAuth = require("../../middlewares/authMiddleware");
const router = express.Router();

router.route("/login").post(authController.login);

module.exports = router;
