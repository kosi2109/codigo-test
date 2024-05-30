const errorHandler = require("../helpers/jsonErrorHandler");
const User = require("../models/user");
const Otp = require("../models/otp");
const { checkOtpErrorIfSameDate } = require("../utils/auth");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { phone, name, password } = req.body;

  let user = await User.findOne({ phone });

  if (user)
    return res
      .status(403)
      .json(errorHandler("phone", "Phone is already Registered."));

  user = new User({
    name,
    phone,
    password,
  });

  user = await user.save();

  // Register Member via mobile number verification with OTP code
  await Otp.create({
    phone,
    otp: 123456,
  });

  if (!user)
    return res.status(500).json(errorHandler("user", "User Create Fail."));

  return res
    .status(200)
    .send(
      "User has successfully created. We've sent otp to your phone number."
    );
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });

  if (!user)
    return res.status(404).json(errorHandler("user", "User Not Found."));

  if (user.verified_at)
    return res
      .status(404)
      .json(errorHandler("user", "User is already verified."));

  const otpCheck = await Otp.findOne({ phone });

  if (!otpCheck) {
    return res.status(401).json(errorHandler("otp", "OTP is not requested."));
  }

  if (otpCheck.otp !== otp) {
    const lastRequest = new Date(otpCheck.updatedAt).toLocaleDateString();
    const isSameDate = lastRequest == new Date().toLocaleDateString();

    if (checkOtpErrorIfSameDate(isSameDate, otpCheck)) {
      return res
        .status(401)
        .json(
          errorHandler("otp", "OTP is wrong 5 times today. Try again tomorrow.")
        );
    }

    // if user latest otp request is not in same date
    if (!isSameDate) {
      otpCheck.otp = "123456"; // Should replace new OTP
      otpCheck.count = 1;
      await otpCheck.save();
    } else {
      // check user otp request is full for today
      if (otpCheck.count === 3) {
        return res
          .status(401)
          .json(
            errorHandler(
              "otp",
              "OTP requests are allowed only 3 times per day. Please try again tomorrow,if you reach the limit."
            )
          );
      } else {
        otpCheck.otp = "123456"; // Should replace new OTP
        otpCheck.count += 1;
        await otpCheck.save();
      }
    }
    return res.status(401).json(errorHandler("otp", "OTP is not correct."));
  }

  user.verified_at = new Date();

  await user.save();

  res.status(200).json({
    message: `Verify Success. Please Login`,
  });
};

const login = async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (!user)
    return res.status(401).json(errorHandler("user", "User not exist ."));

  if (!user.verified_at)
    return res
      .status(401)
      .json(errorHandler("user", "Phone number is not verified ."));

  const correctPass = await user.matchPassword(password);

  if (!correctPass)
    return res
      .status(401)
      .json(errorHandler("password", "Password Not Correct"));

  const tokens = user.generateAuthToken();

  // Single login which means User A login at Device A and User A login at Device B, Device A will automatically logout.
  user.refreshtoken = tokens.refreshtoken;

  await user.save();

  return res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    tokens: tokens,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  user.refreshtoken = null;

  await user.save();

  return res.clearCookie("jwt").send("Logout Success");
};

const refreshToken = async (req, res) => {
  const { refreshtoken } = req.body;

  const { _id } = jwt.verify(refreshtoken, process.env.REFRESH_SECRET_KEY);

  if (!_id)
    return res
      .status(401)
      .json(errorHandler("refreshtoken", "Invalid Refresh token"));

  const user = await User.findById({ _id });

  if (!user) {
    return res
      .status(404)
      .json(errorHandler("user", "User not found"));
  }

  const tokens = user.generateAuthToken();

  return res.status(201).json({
    _id: user._id,
    accesstoken: tokens.accesstoken,
  });
};

const getMe = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
  });
};

module.exports = {
  register,
  login,
  logout,
  verifyOtp,
  refreshToken,
  getMe,
};
