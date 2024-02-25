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
