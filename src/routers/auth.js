const express = require("express");
const route = express.Router();
const validationErrorHandler = require("../helpers/validationErrorHandler");
const { register, login, verifyOtp, refreshToken, logout, getMe } = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  refreshTokenValidator
} = require("../requestValidators/authValidator");
const authMiddleware = require("../middlewares/authMiddleware");

route.post("/register", registerValidator, validationErrorHandler, register);
route.post("/login", loginValidator, validationErrorHandler, login);
route.post("/verify-otp", verifyOtpValidator, validationErrorHandler, verifyOtp);
route.post("/refresh-token", refreshTokenValidator, validationErrorHandler, refreshToken);
route.post("/logout", authMiddleware(), logout);
route.get("/me", authMiddleware(), getMe);

module.exports = route;
