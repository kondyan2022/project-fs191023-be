const { Trainings } = require("../models/trainings");

const getTrainings = async (req, res) => {
  const allTrainings = await Trainings.find();
  res.status(200).json(allTrainings);
};
module.exports = { getTrainings };
