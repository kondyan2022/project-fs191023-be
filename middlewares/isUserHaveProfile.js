const { HttpError } = require("../helpers");

const isUserHaveProfile = (req, res, next) => {
  if (!req.user?.profile) {
    next(HttpError(400, "User must have profile!"));
  }
  next();
};

module.exports = isUserHaveProfile;
