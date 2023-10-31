const express = require("express");
const ctrl = require("../controllers/stats");

const router = express.Router();

router.get("/", ctrl.getStats);

module.exports = router;
