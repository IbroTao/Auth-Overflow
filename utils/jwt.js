const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.SECRET);
  return token;
};

const isTokenValid = (token) => {
  jwt.verify(token, process.env.SECRET);
};

const attachCookiesToResponse = ({ user, res, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const thrityDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    maxAge: oneDay,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    maxAge: thrityDays,
  });
};

module.exports = {
  attachCookiesToResponse,
  isTokenValid,
  createJWT,
};
