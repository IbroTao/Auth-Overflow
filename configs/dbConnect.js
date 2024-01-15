const mongoose = require("mongoose");

const dbConnect = () => {
  return mongoose.connect(process.env.MONGO_URL);
};

module.exports = { dbConnect };
