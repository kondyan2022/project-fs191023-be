const { HttpError } = require("../helpers");

const validateDate = (schema) => {
    const func = (req, res, next) => {
      const { value, error } = schema.validate(req.query);
      if (error) {
        next(HttpError(400, `Invalid query params: ${error.message}`));
      } else {
        if (typeof value.date === 'number') {
          value.date = new Date(value.date).toISOString();
        }
        req.query = { ...req.query, ...value };
        next();
      }
    };
  
    return func;
  };

module.exports = validateDate;
