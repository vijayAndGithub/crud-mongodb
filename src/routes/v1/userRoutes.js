const express = require("express");
const userController = require("../../controllers/v1/userController");
const checkAuth = require("../../middlewares/authMiddleware");
const router = express.Router();

router
  .route("/")
  .post(userController.createUser)
// .get(checkAuth, userController.fetchAllUsers);

router.route('/:userId')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/changeStatus/:userId')
  .patch(userController.changeStatus)




router.route("/login").post(userController.login);

module.exports = router;
