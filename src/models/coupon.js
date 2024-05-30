const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    is_limited: {
      type: Boolean,
      required: true,
      default: false,
    },
    limited_qty: {
      type: Number,
      default: 0,
      nullable: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    point_require: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
