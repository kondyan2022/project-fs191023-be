const express = require('express');
const { authentificate } = require('../middlewares');
const { getProduct, getProductList } = require('../controllers/product.js');

const router = express.Router();

router.get('/', authentificate, getProduct);
router.get('/categories', authentificate, getProductList);

module.exports = router;
