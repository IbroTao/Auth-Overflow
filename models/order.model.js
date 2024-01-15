const mongoose = require("mongoose");

const singleProductOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "products",
  },
});

const orderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [singleProductOrderSchema],
    status: {
      type: String,
      enum: ["pending", "cancelled", "paid", "delivered", "failed"],
      default: "pending",
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };
