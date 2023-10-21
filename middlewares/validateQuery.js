const { HttpError } = require("../helpers");

const validateQuery = (schema) => {
  const func = (req, res, next) => {
    const { value, error } = schema.validate(req.query);
    if (error) {
      next(HttpError(400, `Invalid query params: ${error.message}`));
    }
    req.query = { ...req.query, ...value };
    next();
  };

  return func;
};

module.exports = validateQuery;
