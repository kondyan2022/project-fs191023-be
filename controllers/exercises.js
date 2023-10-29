const { Exercise } = require("../models/exercises");
const { ExerciseGroup } = require("../models/exercisegroups");

const getExerciseGroups = async (req, res) => {
  const exerciseGroups = await ExerciseGroup.find();
  res.json(exerciseGroups);
};
const getExercises = async (req, res) => {
  const exercises = await Exercise.find();
  res.json(exercises);
};

module.exports = { getExercises, getExerciseGroups };
