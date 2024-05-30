const Product = require("../models/product");

const index = async (req, res) => {
  const products = await Product.find();

  return res.status(200).json({
    data: products,
  });
};

module.exports = {
  index,
};
