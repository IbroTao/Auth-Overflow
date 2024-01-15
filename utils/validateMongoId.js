const mongoose = require("mongoose");
const CustomError = require("../errors");

const validateMongoId = (id) => {
  const isValid = mongoose.Schema.Types.ObjectId.isValid(id);
  if (!isValid)
    throw CustomError.notFoundError("This id is not valid or not found!");
};

module.exports = validateMongoId;
