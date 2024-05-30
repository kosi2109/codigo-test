const { check } = require("express-validator");
const mongoose = require("mongoose");

exports.exchangeValidator = [
  check("coupon_id")
    .trim()
    .notEmpty()
    .withMessage("Coupon Id is required.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid coupon_id format"),
];
