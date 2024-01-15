const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customAPIError");
const { not } = require("joi");

class notAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = notAuthenticatedError;
