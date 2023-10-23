const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const productItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    min: 1,
    required: true,
  },
  calories: {
    min: 1,
    type: Number,
    required: true,
  },
  recommend: {
    type: Boolean,
    default: true,
  },
});

const exerciseItemSchema = new Schema({
  bodyPart: {
    type: String,
    required: true,
  },
  equipment: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  burnedCalories: {
    type: Number,
    min: 1,
    required: true,
  },
  time: {
    type: Number,
    min: 1,
    required: true,
  },
});

const diarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: String,
      min: 8,
      max: 8,
      required: true,
    },
    DSN: { type: Number, required: true },
    BMR: { type: Number, required: true },
    products: [productItemSchema],
    exercises: [exerciseItemSchema],
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      burnedCalories: {
        get() {
          return this.exercises.reduce(
            (acc, { burnedCalories }) => acc + burnedCalories,
            0
          );
        },
      },
      consumedCalories: {
        get() {
          return this.products.reduce((acc, { calories }) => acc + calories, 0);
        },
      },
      doneExercisesTime: {
        get() {
          return this.exercises.reduce((acc, { time }) => acc + time, 0);
        },
      },
    },
  }
);

diarySchema.post("save", handleMongooseError);
const Diary = model("diary", diarySchema);

module.exports = { Diary };
