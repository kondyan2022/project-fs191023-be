const validateBody = require("./validateBody");
const validateQuery = require("./validateQuery");
// const upload = require("./upload_old");
const upload = require("./upload");
const resizeAvatar = require("./resizeAvatar");
const isSingleFileExist = require("./isSingleFileExist");
const authentificate = require("./authentificate");
const validateAndConvertDateBody = require("./validateAndConvertDateBody");
const isUserHaveProfile = require("./isUserHaveProfile");

module.exports = {
  validateBody,
  validateQuery,
  upload,
  resizeAvatar,
  isSingleFileExist,
  authentificate,
  validateAndConvertDateBody,
  isUserHaveProfile,
};
