const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmail,
  loginUser,
  getUser,
  validateUserPassword,
  updatePassword,
  updateUserName,
  deleteUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");
router.route("/register").post(createUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/getUser").get(authenticateToken, getUser);
router
  .route("/validateUserPassword")
  .post(authenticateToken, validateUserPassword);
router.route("/updatePassword").put(authenticateToken, updatePassword);
router.route("/updateUserName").put(authenticateToken, updateUserName);
router.route("/deleteUser").delete(authenticateToken, deleteUser);

module.exports = router;
