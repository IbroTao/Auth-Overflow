const jwt = require("jsonwebtoken");
const { Tokens } = require("../models/token.model");

const generateToken = async (
  userId,
  type,
  expiresIn,
  secret = process.env.SECRET
) => {
  const payload = {
    sub: userId,
    expires,
    type,
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.SECRET);
  const verifyTok = await Tokens.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!verifyTok) {
    throw new Error("Token not found");
  }
  return verifyTok;
};
