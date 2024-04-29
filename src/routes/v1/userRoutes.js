const express = require("express");
const userController = require("../../controllers/v1/userController");
const checkAuth = require("../../middlewares/authMiddleware");
const validateRequest = require('../../middlewares/validationMiddleware')
const userValidations = require('../../validations/userValidations')
const router = express.Router();

router
  .route("/")
  .post(
    checkAuth,
    validateRequest(userValidations.createUser),
    userController.createUser)
// .get(checkAuth, userController.fetchAllUsers);

router.route('/:userId')
  .get(
    checkAuth,
    validateRequest(userValidations.getUser),
    userController.getUser)
  .put(
    checkAuth,
    validateRequest(userValidations.updateUser),
    userController.updateUser)
  .delete(
    checkAuth,
    validateRequest(userValidations.deleteUser),
    userController.deleteUser)

router.route('/changeStatus/:userId')
  .patch(
    checkAuth,
    validateRequest(userValidations.changeStatus),
    userController.changeStatus)




router.route("/login").post(userController.login);

module.exports = router;
