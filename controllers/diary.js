const { Diary } = require("../models/diary");
const { Exercise } = require("../models/exercises");
const { User } = require("../models/user");

const postExerciseToDiary = async (req, res, next) => {
  const {
    _id,
    profile: { BMR, DSN },
  } = req.user;
  const {
    exercise: exerciseId,
    date,
    time,
    calories: burnedCalories,
  } = req.body;
  let diaryItem = await Diary.findOne({ date, owner: _id });
  if (!diaryItem) {
    diaryItem = await Diary.create({ date, owner: _id, DSN, BMR });
  }
  const { bodyPart, equipment, name, target } = await Exercise.findById(
    exerciseId
  );
  diaryItem = await Diary.findByIdAndUpdate(
    diaryItem._id,
    {
      $push: {
        exercises: { bodyPart, equipment, name, target, time, burnedCalories },
      },
    },
    { new: true }
  );

  res.json(diaryItem);
};

module.exports = { postExerciseToDiary };
