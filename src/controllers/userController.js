const User = require("../models/user");
const UserPurchase = require("../models/userPurchase");
const redis = require("../utils/redis");
const QRCode = require("qrcode");

const purchaseHistory = async (req, res) => {
  const { _id } = req.user;

  const userpurchase = await UserPurchase.find({ user_id: _id }).populate(
    "products.product_id"
  );

  return res.json({
    data: userpurchase,
  });
};

const getPoints = async (req, res) => {
  const { _id } = req.user;

  // TODO use redis here
  const cache = await redis.get("points_" + _id);

  let wallet = {
    points: 0,
    wallet: 0,
  };

  if (!cache) {
    console.info("from db");
    const user = await User.findById(_id);
    wallet.points = user.points;
    wallet.balance = user.balance;

    redis.set(
      "points_" + _id,
      JSON.stringify({ points: user.points, balance: user.balance })
    );
  } else {
    console.info("from cache");
    const cache_date = JSON.parse(cache);
    wallet.points = cache_date.points;
    wallet.balance = cache_date.balance;
  }

  return res.json({
    data: {
      points: wallet.points,
      balance: wallet.balance,
    },
  });
};

// Note:: data are same as /api/v1/pos/sale's payload
// if Pos casher scan qr get user id and purchase product

const memberQr = async (req, res) => {
  const { _id } = req.user;

  const data = {
    user_id: _id,
    products: [
      {
        product_id: "665752c38d275aea3eac590c",
        qty: 3,
      },
      {
        product_id: "665752c38d275aea3eac590e",
        qty: 2,
      },
    ],
  };

  QRCode.toDataURL(JSON.stringify(data), (err, qr) => {
    if (err) res.status(500).send("Error generating QR code");
    return res.send(`<img src="${qr}">`);
  });
};
module.exports = {
  purchaseHistory,
  getPoints,
  memberQr,
};
