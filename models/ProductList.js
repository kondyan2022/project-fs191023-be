const { Schema, model } = require('mongoose');
const data = require('../resources/products.json')
// const Joi = require("joi");

const { handleMongooseError } = require('../helpers');
const productListSchema = new Schema(
  {
    productCategory: { 
        type: String,
        enum: data,
    }
  },
  { versionKey: false, timestamps: true }
);

productListSchema.post('save', handleMongooseError);

const ProductList = model("categories", productListSchema);

module.exports = { ProductList};