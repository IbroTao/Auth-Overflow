const { Users } = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const CustomError = require("../errors");
const {
  checkPermission,
  createHash,
  attachCookiesToResponse,
  createUserDetails,
  sendPasswordResetToken,
  sendVerificationEmail,
  validateMongoId,
} = require("../utils");
const { Tokens } = require("../models/token.model");
const { hashSync, compareSync } = require("bcryptjs");

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
    password: hashSync(password, 10),
    verificationToken,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
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

  const comparePassword = compareSync(password, user.password);
  if (!comparePassword) {
    throw new CustomError.notAuthenticatedError("Invalid Credentials");
  }

  if (user.isVerified) {
    throw new CustomError.notAuthenticatedError("Please verify this email");
  }

  const tokenUser = createUserDetails(user);
  let refreshToken = "";
  const checkToken = await Tokens.findOne({ userId: user._id });
  if (checkToken) {
    const { isValid } = checkToken;
    if (!isValid) {
      throw new CustomError.notAuthenticatedError("Invalid Credentials");
    }
    refreshToken = checkToken.refreshToken;
    attachCookiesToResponse({ user: tokenUser, refreshToken });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, userId: user._id };

  await Tokens.create(userToken);
  attachCookiesToResponse({ user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
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
  const { email, name } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }

  const user = await Users.findOne({ email });
  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }
  const resetToken = crypto.randomBytes(70).toString("hex");

  await sendPasswordResetToken({
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
