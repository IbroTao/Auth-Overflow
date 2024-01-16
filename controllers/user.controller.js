const { Users } = require("../models/user.model");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createHash,
  checkPermissions,
  createUserDetails
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

const showCurrentUser = async(req, res) => {
    res.status(Status.Codes).json({user: req.user});
};

const updateUser = async(req, res) => {
    const {_id} = req.user;
    validateMongoId(_id);
    const {name, email } = req.body;
    if(!email || !name) {
        throw new CustomError.BadRequestError("Please provide all values")
    };
    const user = await Users.findByIdAndUpdate(_id, {
        name,
        email
    }, {
        new: true
    });
    await user.save();

    const tokenUser = createUserDetails(user);
    attachCookiesToResponse({user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser})
}
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser
};
