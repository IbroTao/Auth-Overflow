const BadRequestError = require("./badRequest");
const notAuthenticatedError = require("./notAuthenticated");
const notAllowed = require("./notAllowed");
const notFoundError = require("./notFound");
const CustomAPIError = require("./customAPIError");

module.exports = {
  CustomAPIError,
  BadRequestError,
  notAllowed,
  notAuthenticatedError,
  notFoundError,
};
