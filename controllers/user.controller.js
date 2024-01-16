const { Users } = require("../models/user.model");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createHash,
  checkPermissions,
  validateMongoId,
} = require("../utils");

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

module.exports = {
  getAllUsers,
  getSingleUser,
};
