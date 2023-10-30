const express = require("express");
const { authentificate, validateDate } = require("../middlewares");
const ctrl = require("../controllers/diary");

const router = express.Router();


router.get("/:date", authentificate, ctrl.diaryByDate);
router.post("/exercise", validateDate, ctrl.postExerciseToDiary);
router.post("/product", authentificate, ctrl.postProductsToDiary);


module.exports = router;
