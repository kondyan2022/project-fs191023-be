const { Exercise } = require("../models/trainings");
const { ExerciseGroup } = require("../models/parts");

const getExerciseGroups = async (req, res) => {
  const allParts = await ExerciseGroup.find();
  res.status(200).json(allParts);
};
const getExercises = async (req, res) => {
  const allTrainings = await Exercise.find();
  res.status(200).json(allTrainings);
};
module.exports = { getExercises, getExerciseGroups };
