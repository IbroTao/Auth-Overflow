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
} = require("../utils");
const {Tokens} = require('../models/token.model')
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

const loginUser = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password")
    };

    const user = await Users.findOne({ email });
    if(!user) {
        throw new CustomError.notFoundError("User not found")
    };

    const comparePassword = compareSync(password, user.password);
    if(!comparePassword) {
        throw new CustomError.notAuthenticatedError("Invalid Credentials");
    }

    if(user.isVerified) {
        throw new CustomError.notAuthenticatedError("Please verify this email");
    };

    const tokenUser = createUserDetails(user);
    let refreshToken = "";
    const checkToken = await Tokens.findOne({user._id});
}

module.exports = {
    registerUser,
    verifyEmail,
    loginUser
}