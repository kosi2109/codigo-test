const mongoose = require("mongoose");

const product = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    qty: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const userPurchaseSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [product],
    total: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const UserPurchase = mongoose.model("UserPurchase", userPurchaseSchema);

module.exports = UserPurchase;
