const { check } = require("express-validator");

exports.registerValidator = [
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required.")
    .isLength({ min: 8, max: 12 })
    .withMessage("Mobile number must be between 8 and 12 characters long"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be greater than 8."),
  check("name").trim().not().isEmpty().withMessage("Name is required."),
];

exports.loginValidator = [
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required.")
    .isLength({ min: 8, max: 12 })
    .withMessage("Mobile number must be between 8 and 12 characters long"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be greater than 8."),
];

exports.verifyOtpValidator = [
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required.")
    .isLength({ min: 8, max: 12 })
    .withMessage("Mobile number must be between 8 and 12 characters long"),
  check("otp")
    .trim()
    .notEmpty()
    .withMessage("Otp is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Otp must be exactly 6 digit."),
];

exports.refreshTokenValidator = [
  check("refreshtoken").trim().notEmpty().withMessage("Refresh token is required."),
];
