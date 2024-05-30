const errorHandler = require("../helpers/jsonErrorHandler");
const Coupon = require("../models/coupon");
const CouponExchange = require("../models/couponExchange");
const User = require("../models/user");

const index = async (req, res) => {
  const coupons = await Coupon.find({});

  return res.json({
    data: coupons,
  });
};

const exchange = async (req, res) => {
  const { coupon_id } = req.body;

  const coupon = await Coupon.findById(coupon_id);

  if (!coupon) {
    return res.status(404).json(errorHandler("coupon", "Coupon not found."));
  }

  const { _id } = req.user;

  const user = await User.findById(_id);

  if (coupon.is_limited && coupon.limited_qty < 1) {
    return res
      .status(400)
      .json(errorHandler("coupon", "Coupon is out of stock."));
  }

  if (user.points < coupon.point_require) {
    return res.status(400).json(errorHandler("points", "Point not enough."));
  }

  user.points = parseInt(user.points) - parseInt(coupon.point_require);
  user.balance = parseInt(user.balance) + parseInt(coupon.amount);

  await user.save();

  if (coupon.is_limited) {
    coupon.limited_qty = coupon.limited_qty - 1;
  }

  await coupon.save();

  await CouponExchange.create({
    user_id: user._id,
    coupon_id: coupon._id,
  });

  return res.json({
    message: "Coupon was scuuessfully exchanged.",
  });
};

module.exports = {
  index,
  exchange,
};
