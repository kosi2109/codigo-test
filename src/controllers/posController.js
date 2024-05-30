const { pointCalQueue } = require("../utils/queue");

// QR: Calculate member points from member QR
// Note:: data will come from member's qr
const sale = async (req, res) => {
  const { user_id, products } = req.body;

  // calculate with queue
  pointCalQueue.add({ user_id, products });

  return res.json({
    message: "Success! Point is calculation in background",
  });
};

module.exports = {
  sale,
};
