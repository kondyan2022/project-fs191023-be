const ctrlWrapper = require("../helpers/ctrlWrapper.js");
const { Product } = require("../models/Product.js");
const { ProductList } = require("../models/ProductList.js");

const getProduct = async (req, res) => {
  const product = await Product.find();
  console.log(product.length);
  res.json(product);
};

const getProductList = async (req, res) => {
  const productList = await ProductList.find();
  res.json(productList);
};

const getProductsSearch = async (req, res) => {
  const { q = "", category, page = 0, limit = 20, recommend } = req.query;
  const options = {
    title: { $regex: q, $options: "i" },
  };
  if (category) {
    options.category = category;
  }
  // const recommendObj =
  console.log({ recommend });
  if (recommend !== undefined) {
    const {
      profile: { blood },
    } = req.user;

    options["groupBloodNotAllowed." + blood] = !recommend;
    // options.groupBloodNotAllowed["$elemMatch"] = { [blood]: !recommend };
  }
  console.log(options);
  const product = await Product.find(options)
    .limit(limit)
    .skip(limit * page)
    .sort({ title: 1 });
  const { length: totalCount } = await Product.find(options);
  const totalPage = Math.ceil(totalCount / limit);

  res.json({
    searchkey: q,
    category: category ? category : "All",
    page,
    limit,
    totalPage,
    totalCount,
    result: product,
  });
};

module.exports = {
  getProduct: ctrlWrapper(getProduct),
  getProductList: ctrlWrapper(getProductList),
  getProductsSearch: ctrlWrapper(getProductsSearch),
};
