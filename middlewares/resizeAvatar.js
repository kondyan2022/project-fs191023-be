const Jimp = require("jimp");
const fs = require("fs/promises");
const { HttpError } = require("../helpers");

const resizeAvatar = async (req, res, next) => {
  const { path } = req.file;
  try {
    const image = await Jimp.read(path);
    await image.resize(250, 250);
    await image.writeAsync(path);
    next();
  } catch (error) {
    error.status = 400;
    console.log(error);
    await fs.unlink(path);
    next(error);
  }
};

module.exports = resizeAvatar;
