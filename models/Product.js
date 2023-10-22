const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const groupBloodNotAllowedSchema = new Schema(
  {
    1: {
      type: Boolean,
      default: false,
    },
    2: {
      type: Boolean,
      default: false,
    },
    3: {
      type: Boolean,
      default: false,
    },
    4: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    weight: {
      type: Number,
    },
    calories: {
      type: Number,
    },
    category: {
      type: String,
    },
    title: {
      type: String,
    },
    groupBloodNotAllowed: {
      type: groupBloodNotAllowedSchema,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productSchema.post("save", handleMongooseError);

const Product = model("products", productSchema);

module.exports = { Product };
