const { Users } = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const CustomError = require("../errors");
const {
  checkPermission,
  createHash,
  attachCookiesToResponse,
  sendPasswordResetToken,
  sendVerificationEmail,
} = require("../utils");

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
    password,
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
