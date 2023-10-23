const ctrlWrapper = require("../helpers/ctrlWrapper.js");
const { Product } = require("../models/Product.js");
const { ProductList } = require("../models/ProductList.js");

const getProduct = async (req, res) => {
  const product = await Product.find();
  res.json(product);
};

const getProductList = async (req, res) => {
  const productList = await ProductList.find();
  res.json(productList);
};

module.exports = {
  getProduct: ctrlWrapper(getProduct),
  getProductList: ctrlWrapper(getProductList),
};
