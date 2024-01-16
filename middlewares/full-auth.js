const isTokenValid = require("../utils/jwt");
const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new CustomError.notAuthenticatedError("Authentication failed");
  }
  try {
    const payload = isTokenValid(token);
    req.user = {
      userId: payload.user._id,
      role: payload.user.role,
    };
    next();
  } catch (error) {
    throw new CustomError.notAuthenticatedError("Token is invalid");
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.notAllowed("Unauthorized to access this route!");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
};
