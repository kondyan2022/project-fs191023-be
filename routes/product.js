const express = require("express");
const { authentificate } = require("../middlewares");
const ctrl = require("../controllers/product.js");

const router = express.Router();

router.get("/", authentificate, ctrl.getProduct);
router.get("/categories", authentificate, ctrl.getProductList);

module.exports = router;
