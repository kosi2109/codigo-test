const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    }
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
