const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      minlength: 1,
      maxlength: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    reviewedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("reviews", reviewSchema);

module.exports = { Reviews };
