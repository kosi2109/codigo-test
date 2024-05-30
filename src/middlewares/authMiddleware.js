const errorHandler = require("../helpers/jsonErrorHandler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function authMiddleware() {
  return async (req, res, next) => {
    var token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const { _id } = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        const user = await User.findById(_id).select("-password");

        // check refresh token still exist or not expired
        jwt.verify(user.refreshtoken, process.env.REFRESH_SECRET_KEY);

        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json(errorHandler("auth", "Invalid Token"));
      }
    }

    if (!token) {
      return res.status(401).json(errorHandler("auth", "Token not found"));
    }
  };
}

module.exports = authMiddleware;
