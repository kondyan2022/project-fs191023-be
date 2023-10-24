const express = require("express");
const { authentificate, validateDate } = require("../middlewares");
const ctrl = require("../controllers/diary");

const router = express.Router();

router.post("/exercise", authentificate, validateDate, ctrl.postExerciseToDiary);
router.post("/product", authentificate, validateDate, ctrl.postProductsToDiary);

module.exports = router;
