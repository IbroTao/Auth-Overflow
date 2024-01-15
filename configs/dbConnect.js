const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URL;

const dbConnect = () => {
  return mongoose.connect(mongoURL);
};

module.exports = { dbConnect };
