const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    points: {
      type : Number,
      required: true,
      default: 10 // for dummy
    },
    balance: {
      type : Number,
      required: true,
      default: 100 // for dummy
    },
    verified_at: {
      type: Date,
      default: null,
      required: false,
      nullable: true,
    },
    refreshtoken: {
      type: String,
      default: null,
      required: false,
      nullable: true,
    },
  },
  { timestamps: true }
);

// add method to user model to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt user's password when save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
});

userSchema.methods.generateAuthToken = function () {
  const accesstoken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: "10m", // set shorter time in real world
    }
  );
  const refreshtoken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const tokens = { accesstoken: accesstoken, refreshtoken: refreshtoken };
  return tokens;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
