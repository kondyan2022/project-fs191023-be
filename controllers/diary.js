const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/Product");
const { Diary } = require("../models/diary");
const { Exercise } = require("../models/exercises");

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

const postProductsToDiary = async (req, res, next) => {
  const {
    _id,
    profile: { BMR, DSN, blood },
  } = req.user;
  const {
    product: productId,
    date,
    amount,
    calories: consumeCalories,
  } = req.body;
  let diaryItem = await Diary.findOne({ date, owner: _id });
  if (!diaryItem) {
    diaryItem = await Diary.create({ date, owner: _id, DSN, BMR });
  }
  const { title, category, groupBloodNotAllowed } = await Product.findById(
    productId
  );

  diaryItem = await Diary.findByIdAndUpdate(
    diaryItem._id,
    {
      $push: {
        products: {
          title,
          category,
          weight: amount,
          consumeCalories,
          recommend: !groupBloodNotAllowed[blood],
        },
      },
    },
    { new: true }
  );

  res.json(diaryItem);
};

const deleteProductsFromDiary = async (req, res, next) => {
  const { _id } = req.user;
  const { date, itemid } = req.body;

  let diaryItem = await Diary.findOne({ date, owner: _id });

  if (!diaryItem) {
    throw HttpError(404, "Diary not found");
  }

  diaryItem = await Diary.findByIdAndUpdate(
    diaryItem._id,
    {
      $pull: {
        products: { _id: itemid },
      },
    },
    { new: true }
  );
  res.json(diaryItem);
};

const diaryByDate = async (req, res) => {
  const {
    _id,
    profile: { DSN, BMR },
  } = req.user;
  const { date } = req.params;

  let diaryItem = await Diary.findOne({ date, owner: _id });
  if (!diaryItem) {
    diaryItem = {
      owner: _id,
      date,
      DSN,
      BMR,
      products: [],
      exercises: [],
      burnedCalories: 0,
      consumedCalories: 0,
      doneExercisesTime: 0,
    };
  }
  res.json(diaryItem);
};
module.exports = {
  postExerciseToDiary: ctrlWrapper(postExerciseToDiary),
  postProductsToDiary: ctrlWrapper(postProductsToDiary),
  diaryByDate: ctrlWrapper(diaryByDate),
  deleteProductsFromDiary: ctrlWrapper(deleteProductsFromDiary),
};
