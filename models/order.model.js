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
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "paid", "delivered", "failed"],
      default: "pending",
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
