const CustomError = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils");
const { Tokens } = require("../models/token.model");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      next();
    }

    const payload = isTokenValid(refreshToken);
    const existingToken = await Tokens.findOne({
      user: payload.user._id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken) {
      throw new CustomError.notAuthenticatedError(
        "No Refresh Token in the Cookies"
      );
    }

    attachCookiesToResponse({
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.notAuthenticatedError("Authentication failed!");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.notAllowed("Unauthorized to access this route!");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
