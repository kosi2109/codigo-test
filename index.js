const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config();

// _____ middleware _____
const allowOrigins = ["http://localhost:3000"];

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  optionsSuccessStatus: 200,
};

app.use(credentials);
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json({}));
app.use(morgan("tiny"));
app.use(cookieParser());

// _____ routing _____

const { auth, product, pos, coupon, user } = require("./src/routers");
const Product = require("./src/models/product");
const Coupon = require("./src/models/coupon");

const API_END_POINT = "/api/v1";

app.use(`${API_END_POINT}/auth`, auth);
app.use(`${API_END_POINT}/products`, product);
app.use(`${API_END_POINT}/pos`, pos);
app.use(`${API_END_POINT}/coupons`, coupon);
app.use(`${API_END_POINT}/users`, user);

app.post(`${API_END_POINT}/coupons/create`, async (req, res) => {
  await Coupon.create({
    name: "$10 coupon",
    is_limited: false,
    amount: 1,
    point_require: 100,
  });
  await Coupon.create({
    name: "$5 coupon",
    is_limited: false,
    amount: 5,
    point_require: 500,
  });
  await Coupon.create({
    name: "$10 limited Coupon",
    is_limited: true,
    limited_qty: 5,
    amount: 10,
    point_require: 100,
  });
  await Coupon.create({
    name: "$1 limited Coupon",
    is_limited: true,
    limited_qty: 10,
    amount: 1,
    point_require: 10,
  });

  return res.json("test");
});

app.post(`${API_END_POINT}/products/create`, async (req, res) => {
  await Product.create({
    name: "Apple",
    price: 10,
    is_alcoholic: false,
  });
  await Product.create({
    name: "Orange",
    price: 30,
    is_alcoholic: false,
  });
  await Product.create({
    name: "Playstation",
    price: 150,
    is_alcoholic: false,
  });
  await Product.create({
    name: "Blue Label",
    price: 100,
    is_alcoholic: true,
  });

  await Product.create({
    name: "Gold Label",
    price: 120,
    is_alcoholic: true,
  });

  return res.json("test");
});

// _____ server _____
const PORT = process.env.PORT || 8080;

//Database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connection is ready");
    app.listen(PORT, () => {
      console.log(
        `server listening on http://localhost:${PORT}${API_END_POINT}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
