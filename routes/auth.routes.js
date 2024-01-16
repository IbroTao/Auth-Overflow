const express = require("express");
const router = express.Router();

const {
  loginUser,
  logoutUser,
  registerUser,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
