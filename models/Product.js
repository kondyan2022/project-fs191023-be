const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

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

const getProductsSearchQuery = Joi.object({
  q: Joi.string(),
  catgory: Joi.string(),
  limit: Joi.number().min(1),
  page: Joi.number().min(0),
  recommend: Joi.boolean(),
}).unknown();

const schemas = {
  getProductsSearchQuery,
};

module.exports = { Product, schemas };
