const { HttpError, ctrlWrapper, reverseDate } = require("../helpers");
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
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    throw HttpError(404, `Exersice with id=${exerciseId} not found"`);
  }

  const { bodyPart, equipment, name, target } = exercise;
  diaryItem = await Diary.findByIdAndUpdate(
    diaryItem._id,
    {
      $push: {
        exercises: { bodyPart, equipment, name, target, time, burnedCalories },
      },
    },
    {
      new: true,
      select: "-createdAt -updatedAt ",
    }
  );
  diaryItem.date = reverseDate(diaryItem.date);

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
  const product = await Product.findById(productId);
  if (!product) {
    throw HttpError(400, `Product with id=${productId} not found`);
  }

  const { title, category, groupBloodNotAllowed } = product;
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
    {
      new: true,
      select: "-createdAt -updatedAt ",
    }
  );
  diaryItem.date = reverseDate(diaryItem.date);
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
    { new: true, select: "-createdAt -updatedAt " }
  );
  diaryItem.date = reverseDate(diaryItem.date);
  res.json(diaryItem);
};

const deleteExercisesFromDiary = async (req, res, next) => {
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
        exercises: { _id: itemid },
      },
    },
    { new: true, select: "-createdAt -updatedAt " }
  );
  diaryItem.date = reverseDate(diaryItem.date);
  res.json(diaryItem);
};

const deleteFromDiary = async (req, res, next) => {
  const { _id } = req.user;
  const { date, itemid, tablename } = req.body;

  let diaryItem = await Diary.findOne({ date, owner: _id });

  if (!diaryItem) {
    throw HttpError(404, "Diary not found");
  }
  console.log({ date, itemid, tablename });
  diaryItem = await Diary.findByIdAndUpdate(
    diaryItem._id,
    {
      $pull: {
        [tablename]: { _id: itemid },
      },
    },
    { new: true, select: "-createdAt -updatedAt " }
  );
  diaryItem.date = reverseDate(diaryItem.date);
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
      leftExercisesTime: DSN,
      leftCalories: BMR,
    };
  }
  diaryItem.date = reverseDate(diaryItem.date);
  res.json(diaryItem);
};

module.exports = {
  postExerciseToDiary: ctrlWrapper(postExerciseToDiary),
  postProductsToDiary: ctrlWrapper(postProductsToDiary),
  diaryByDate: ctrlWrapper(diaryByDate),
  deleteProductsFromDiary: ctrlWrapper(deleteProductsFromDiary),
  deleteExercisesFromDiary: ctrlWrapper(deleteExercisesFromDiary),
  deleteFromDiary: ctrlWrapper(deleteFromDiary),
};
