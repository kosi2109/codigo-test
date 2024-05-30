const { validationResult } = require("express-validator");

// middleware for handle validation that come from express-validator

function validationErrorHandler(req, res, next) {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

module.exports = validationErrorHandler;
