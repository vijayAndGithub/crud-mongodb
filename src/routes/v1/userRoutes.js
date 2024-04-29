const express = require("express");
const userController = require("../../controllers/v1/userController");
const checkAuth = require("../../middlewares/authMiddleware");
const router = express.Router();

router
  .route("/")
  .post(
    checkAuth,
    userController.createUser)
// .get(checkAuth, userController.fetchAllUsers);

router.route('/:userId')
  .get(
    checkAuth,
    userController.getUser)
  .put(
    checkAuth,
    userController.updateUser)
  .delete(
    checkAuth,
    userController.deleteUser)

router.route('/changeStatus/:userId')
  .patch(
    checkAuth,
    userController.changeStatus)




router.route("/login").post(userController.login);

module.exports = router;
