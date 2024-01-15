const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name!"],
      maxlength: [100, "Name cannot be more than 100 characters!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price!"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description!"],
      maxlength: [100, "Description cannot be more than 100"],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please provide product category!"],
      enum: ["electronics", "household", "utensils", "toiletries"],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: String,
      default: ["white"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual("review", {
  ref: "reviews",
  localField: "_id",
  foreignField: "_id",
  justOnce: false,
});

const Products = mongoose.model("products", productSchema);

module.exports = { Products };
