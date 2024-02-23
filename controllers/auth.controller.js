const { Users } = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const CustomError = require("../errors");
const { sendPasswordResetEmail } = require("../utils/sendPasswordResetToken");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail");
const bcrypt = require("bcryptjs");
const { generateRefreshToken } = require("../configs/generateRefrehToken");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await Users.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists!");
  }

  const isFirstAccount = (await Users.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await Users.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    verificationToken,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    user: user,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    throw new CustomError.notAuthenticatedError("Verification failed!");
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.notAuthenticatedError("Verification failed!");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = null;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email verified" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }

  const comparePassword = bcrypt.compareSync(password, user.password);
  if (!comparePassword) {
    throw new CustomError.notAuthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new CustomError.notAuthenticatedError("Please verify this email");
  }

  const refreshToken = generateRefreshToken(user._id);
  const loginUser = await Users.findByIdAndUpdate(
    user._id,
    {
      refreshToken: refreshToken,
    },
    {
      new: true,
    }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  res.status(StatusCodes.OK).json({ msg: "User logged in", user });
};

const logoutUser = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken)
    throw new CustomError.BadRequestError("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await Users.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }
  const logout = await Users.findOneAndUpdate(
    {
      refreshToken,
    },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(StatusCodes.FORBIDDEN);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }
  const resetToken = crypto.randomBytes(70).toString("hex");

  await sendPasswordResetEmail({
    name: user.name,
    token: resetToken,
  });

  user.passwordResetToken = createHash(resetToken);
  user.passwordResetTokenExpiration = Date.now() * 1000 * 10 * 60;
  const newUser = await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Please check your email for reset password link",
    user: newUser,
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await Users.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Token expired!, Try again." });
  }
  user.password = hashSync(password, 12);
  user.passwordResetToken = null;
  user.passwordResetTokenExpiration = null;
  const newUser = await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Password reset successfully", user: newUser });
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
