const express = require("express");
const route = express.Router();
const {
  purchaseHistory,
  getPoints,
  memberQr,
} = require("../controllers/userController");
const { userCreateValidator } = require("../requestValidators/authValidator");
const validationErrorHandler = require("../helpers/validationErrorHandler");
const authMiddleware = require("../middlewares/authMiddleware");

route.use(authMiddleware());

// for user to get latest update
route.get("/purchase-history", purchaseHistory);
route.get("/points", getPoints);
route.get("/qrcode", memberQr);

module.exports = route;
