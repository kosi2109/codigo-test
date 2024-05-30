const mongoose = require("mongoose");

const couponExchangeSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Coupon",
    },
  },
  { timestamps: true }
);

const CouponExchange = mongoose.model("CouponExchange", couponExchangeSchema);

module.exports = CouponExchange;
