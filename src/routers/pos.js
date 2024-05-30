const express = require("express");
const route = express.Router();
const { sale } = require("../controllers/posController");
const { purchaseValidator } = require("../requestValidators/posValidator");
const validationErrorHandler = require("../helpers/validationErrorHandler");

route.post("/sale", purchaseValidator, validationErrorHandler, sale);

module.exports = route;