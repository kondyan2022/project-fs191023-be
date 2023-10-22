const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const { Product } = require('../models/product.js');
const { ProductList } = require('../models/productList.js');

const getProduct = async (req, res) => {
  const product = await Product.find();
  res.status(200).json({
    status: "OK",
    code: 200,
    data: product,
    });
};

const getProductList = async (req, res) => {
  const productList = await ProductList.find();
  res.status(200).json({
    status: "OK",
    code: 200,
    data: productList,
    });
};

module.exports = { 
    getProduct: ctrlWrapper(getProduct), 
    getProductList: ctrlWrapper(getProductList), 
};