const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        count: {
          type: Number,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    cartTotal: {
      type: Number,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("carts", cartSchema);

module.exports = { Orders };
