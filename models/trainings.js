const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const trainingSchema = new Schema(
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

trainingSchema.post("save", handleMongooseError);

const Exercise = model("trainings", trainingSchema);

// const registerSchema = Joi.object({
//   password: Joi.string().min(6).required(),
//   email: Joi.string().email().required(),
// });

// const loginSchema = Joi.object({
//   password: Joi.string().min(6).required(),
//   email: Joi.string().email().required(),
// });

// const verifySchema = Joi.object({
//   email: Joi.string().email().required(),
// }).messages({ "any.required": "missing required field email" });

// const schemas = {
//   registerSchema,
//   loginSchema,
//   verifySchema,
// };

module.exports = { Exercise };
