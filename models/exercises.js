const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const exerciseSchema = new Schema(
  {
    bodyPart: String,
    equipment: String,
    gifUrl: String,
    name: String,
    target: String,
    burnedCalories: Number,
    time: Number,
  },
  { versionKey: false, timestamps: true }
);

const getExercisesSearchQuery = Joi.object({
  filter: Joi.string(),
  value: Joi.string(),
  target: Joi.string(),
  limit: Joi.number().min(1),
  page: Joi.number().min(0),
}).unknown();

exerciseSchema.post("save", handleMongooseError);

const Exercise = model("exercise", exerciseSchema);

const schemas = {
  getExercisesSearchQuery,
};

module.exports = { Exercise, schemas };
