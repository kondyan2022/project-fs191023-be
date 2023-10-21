const { HttpError } = require("../helpers");

const isSingleFileExist = (req, res, next) => {
  if (!req?.file) {
    next(HttpError(400, "Image file reqiured"));
  }
  next();
};

module.exports = isSingleFileExist;
