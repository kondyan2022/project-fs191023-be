const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const productSchema = new Schema(
  {
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    weight: {
      type: Number
    },
    calories: {
      type: Number
    },
    category: {
        type: String
    },
    title: {
        type: String,
    },
    groupBloodNotAllowed: {
        type: Map,
        of: Boolean,
    },
  },
  { versionKey: false, timestamps: true }
);

productSchema.post("save", handleMongooseError);

const Product = model("products", productSchema);

module.exports = { Product};