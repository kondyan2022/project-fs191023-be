const validateBody = require("./validateBody");
const validateQuery = require("./validateQuery");
const isValidId = require("./isValidId");
const upload = require("./upload");
const resizeAvatar = require("./resizeAvatar");
const isSingleFileExist = require("./isSingleFileExist");
const authentificate = require("./authentificate");

module.exports = {
  validateBody,
  validateQuery,
  isValidId,
  upload,
  resizeAvatar,
  isSingleFileExist,
  authentificate,
};
