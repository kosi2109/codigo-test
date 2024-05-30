const express = require("express");
const route = express.Router();
const { index } = require("../controllers/productController");

route.get("/", index);

module.exports = route;
