const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Paid", "Delivered", "Failed"],
      default: "Pending",
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    paymentIntent: {},
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("orders", orderSchema);

module.exports = { Orders };
