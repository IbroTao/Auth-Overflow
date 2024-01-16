const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/full-auth");

const {
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/user.controller");

router.route("/").get(authenticateUser, authorizeRoles("admin", getAllUsers));
router.route("/current").get(authenticateUser, showCurrentUser);
router.route("/reset-password/:token").post(resetPassword);
router.route("/forget-password-token").post(forgotPassword);
router.route("/verify-email").post(verifyEmail);
router.route("/:id").get(authenticateUser, getSingleUser);
router.route("/password").put(authenticateUser, updateUserPassword);
router.route("/").put(authenticateUser, updateUser);

module.exports = router;
