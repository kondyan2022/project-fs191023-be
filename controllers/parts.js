const { Parts } = require("../models/parts");

const getParts = async (req, res) => {
  const allParts = await Parts.find();
  res.status(200).json(allParts);
};
module.exports = { getParts };
