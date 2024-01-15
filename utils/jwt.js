const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.SECRET);
  return token;
};

const isValid = (token) => {
  jwt.verify(token, process.env.SECRET);
};

const attachCookiesToResponse = ({ req, res, refreshToken }) => {
  const accessToken = createJWT({ payload: { user } });
  const refreshToken = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const thrityDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: oneDay,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: thrityDays,
  });
};

module.exports = {
  attachCookiesToResponse,
  isValid,
  createJWT,
};
