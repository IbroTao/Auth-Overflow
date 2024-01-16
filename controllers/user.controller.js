const { Users } = require("../models/user.model");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { validateMongoId } = require("../utils/validateMongoId");
const { createUserDetails } = require("../utils/createUserDetails");

const getAllUsers = async (req, res) => {
  const users = await Users.find({ role: "user" }).select(["-password"]);
  res.status(StatusCodes.OK).json({ users: users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const user = await Users.findById({ id }).select(["-password"]);
  if (!user) {
    throw new CustomError.notFoundError(
      `No user with this id: ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ user: user });
};

const showCurrentUser = async (req, res) => {
  res.status(Status.Codes).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const { name, email } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await Users.findByIdAndUpdate(
    _id,
    {
      name,
      email,
    },
    {
      new: true,
    }
  );
  await user.save();

  const tokenUser = createUserDetails(user);
  attachCookiesToResponse({ user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await Users.findOne({ _id });
  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }

  const comparePassword = compareSync(user.password, oldPassword);
  if (!comparePassword) {
    throw new CustomError.BadRequestError("Invalid Credentials!");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password updated." });
};
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
