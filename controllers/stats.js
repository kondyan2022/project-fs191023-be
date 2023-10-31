const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/Product");
const { Diary } = require("../models/diary");
const { Exercise } = require("../models/exercises");
const { User } = require("../models/user");

const getStats = async (req, res) => {
  const stats = await Diary.aggregate([
    {
      $group: {
        _id: null,
        countOfExercises: { $sum: { $size: "$exercises" } },
        totalBurnedCalories: {
          $sum: {
            $sum: "$exercises.burnedCalories",
          },
        },
        totalExercisesTime: {
          $sum: {
            $sum: "$exercises.time",
          },
        },
      },
    },
  ]);
  stats[0].userCount = (await User.find()).length;
  stats[0].videoGuides = (await Exercise.find()).length;
  stats[0].totalExercisesTime = Math.round(stats[0].totalExercisesTime / 3600);
  delete stats[0]["_id"];
  res.json(stats[0]);
};

module.exports = {
  getStats: ctrlWrapper(getStats),
};
