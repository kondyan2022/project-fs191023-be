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

const getExercisesSearch = async (req, res) => {
  const { filter, value = "", target = "", limit = 20, page = 0 } = req.query;

  const options = {};

  if (filter) {
    options[filter] = value;
  }

  if (target) {
    options.target = target;
  }

  const exercises = await Exercise.find(options)
    .limit(limit)
    .skip(limit * page)
    .sort({ title: 1 });
  const { length: totalCount } = await Exercise.find(options);
  const totalPage = Math.ceil(totalCount / limit);

  res.json({
    filter: filter ? options : "All",
    page,
    limit,
    totalPage,
    totalCount,
    result: exercises,
  });
};

module.exports = { getExercises, getExerciseGroups, getExercisesSearch };
