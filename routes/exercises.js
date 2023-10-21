const express = require("express");

const { authentificate } = require("../middlewares");
const { getTrainings, getParts } = require("../controllers/exercises");

const router = express.Router();

router.get("/trainings", authentificate, getTrainings);
router.get("/filters", authentificate, getParts);
module.exports = router;
