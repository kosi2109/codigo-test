const { redis } = require("../config/redis");

exports.set = async (key, value) => {
  await redis.set(key, value);
};

exports.get = async (key) => {
  return await redis.get(key);
};

exports.del = async (key) => {
  await redis.del(key);
};
