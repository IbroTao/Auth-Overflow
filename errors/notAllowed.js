const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customAPIError");

class notAllowed extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = notAllowed;
