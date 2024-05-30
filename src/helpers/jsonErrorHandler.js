const errorHandler = (path, msg) => {
  return { errors: [{ msg, path }] };
};

module.exports = errorHandler;