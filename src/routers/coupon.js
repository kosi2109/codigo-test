const express = require("express");
const route = express.Router();
const { index, exchange } = require("../controllers/couponController");
const validationErrorHandler = require("../helpers/validationErrorHandler");
const { exchangeValidator } = require("../requestValidators/couponValidator");
const authMiddleware = require("../middlewares/authMiddleware");

route.get("/", index);

route.use(authMiddleware());

route.post("/exchange", exchangeValidator, validationErrorHandler, exchange);

module.exports = route;
