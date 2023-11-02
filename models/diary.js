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
  consumeCalories: {
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
          return this.products.reduce(
            (acc, { consumeCalories }) => acc + consumeCalories,
            0
          );
        },
      },
      leftExercisesTime: {
        get() {
          return (
            this.DSN -
            Math.round(
              this.exercises.reduce((acc, { time }) => acc + time, 0) / 60
            )
          );
        },
      },
      leftCalories: {
        get() {
          return (
            this.BMR -
            Math.round(
              this.products.reduce(
                (acc, { consumeCalories }) => acc + consumeCalories,
                0
              )
            )
          );
        },
      },
    },
  }
);

diarySchema.post("save", handleMongooseError);
const Diary = model("diary", diarySchema);

const getDiarySchemaParams = Joi.object({
  date: Joi.string()
    .pattern(
      /^(19[0-9][0-9]|20[012][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
    )
    .message("Invalid data format. dd/mm/yyyy required!"),
});

const addProductSchema = Joi.object({
  product: Joi.string().required(),
  date: Joi.string()
    .pattern(
      /^(19[0-9][0-9]|20[012][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
    )
    .message("Invalid data format. dd/mm/yyyy required!")
    .required(),
  amount: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
});

const addExerciseSchema = Joi.object({
  exercise: Joi.string().required(),
  date: Joi.string()
    .pattern(
      /^(19[0-9][0-9]|20[012][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/
    )
    .message("Invalid data format. dd/mm/yyyy required!")
    .required(),
  time: Joi.number().min(1).required(),
  calories: Joi.number().min(1).required(),
});

const schemas = {
  getDiarySchemaParams,
  addProductSchema,
  addExerciseSchema,
};

module.exports = { Diary, schemas };
