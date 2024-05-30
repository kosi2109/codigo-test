const { check } = require("express-validator");
const mongoose = require("mongoose");

exports.purchaseValidator = [
  check("user_id")
    .trim()
    .notEmpty()
    .withMessage("User Id is required.")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user_id format"),
  check("products").isArray().withMessage("Products should be an array"),
  check("products.*.product_id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product_id format"),
  check("products.*.qty")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];
