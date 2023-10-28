const express = require("express");
const { authentificate, validateQuery } = require("../middlewares");
const ctrl = require("../controllers/product.js");
const { schemas } = require("../models/Product");

const router = express.Router();

router.get("/", authentificate, ctrl.getProduct);
router.get("/categories", authentificate, ctrl.getProductList);
router.get(
  "/search",
  authentificate,
  validateQuery(schemas.getProductsSearchQuery),
  ctrl.getProductsSearch
);

module.exports = router;
