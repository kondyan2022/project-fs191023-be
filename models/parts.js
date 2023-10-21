const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const exerciseGroupSchema = new Schema(
  {
    filter: String,
    name: String,
    imgURL: String,
  },
  { versionKey: false, timestamps: true }
);

exerciseGroupSchema.post("save", handleMongooseError);

const ExerciseGroup = model("parts", exerciseGroupSchema);

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

module.exports = { ExerciseGroup };
