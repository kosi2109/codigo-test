const Queue = require("bull");
const User = require("../models/user");
const UserPurchase = require("../models/userPurchase");
const Product = require("../models/product");
const redis = require("../utils/redis");
const pointCalQueue = new Queue("point calculation", process.env.REDIS_URL);

pointCalQueue.process(async (data) => {
  try {
    const { user_id, products } = data.data;

    const selected_products = await Product.find({
      _id: { $in: products.map((product) => product.product_id) },
    });

    //   give point to non alcoholic product
    const non_alcoholic_total = selected_products?.reduce(
      (pre, current) =>
        current.is_alcoholic
          ? pre + 0
          : pre +
            current.price *
              products.find((prd) => prd.product_id == current._id).qty,
      0
    );

    //   get grand total for all product
    const total = selected_products?.reduce(
      (pre, current) =>
        pre +
        current.price *
          products.find((prd) => prd.product_id == current._id).qty,
      0
    );

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json(errorHandler("user", "User not found."));
    }

    if (user.balance < total) {
      return res
        .status(404)
        .json(errorHandler("balance", "Not Enough Balance."));
    }

    // give 10% of non alcoholic product
    const points = parseInt(((10 / 100) * non_alcoholic_total).toFixed(2));

    user.points = parseInt(user.points) + points;

    user.balance = parseInt(user.balance) - total;

    redis.set(
      "points_" + user._id,
      JSON.stringify({ points: user.points, balance: user.balance })
    );

    // user purchase and user balance should not user in here 
    // but I'm not clear instruction where user can purchase
    
    await user.save();

    await UserPurchase.create({
      user_id: user._id,
      products,
      total: total,
      points: points,
    });
  } catch (error) {
    // log to somewhere
    console.error(error);
  }
});

module.exports = {
  pointCalQueue,
};
