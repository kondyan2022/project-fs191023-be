const { Trainings } = require("../models/trainings");
const { Parts } = require("../models/parts");

const getParts = async (req, res) => {
  const allParts = await Parts.find();
  res.status(200).json(allParts);
};
const getTrainings = async (req, res) => {
  const allTrainings = await Trainings.find();
  res.status(200).json(allTrainings);
};
module.exports = { getTrainings, getParts };
