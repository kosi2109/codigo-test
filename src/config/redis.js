const ioredis = require("ioredis");

const redis = new ioredis.Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redis.on("connect", () => {
  console.info("Redis connected successfully.");
});

module.exports = {
    redis
}
