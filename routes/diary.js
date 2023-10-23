const express = require("express");
const { authentificate } = require("../middlewares");
const ctrl = require("../controllers/diary");

const router = express.Router();

router.post("/exercise", authentificate, ctrl.postExerciseToDiary);

module.exports = router;
