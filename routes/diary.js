const express = require("express");
const {
  authentificate,
  validateDate,
  validateBody,
  validateQuery,
} = require("../middlewares");
const ctrl = require("../controllers/diary");
const { schemas } = require("../models/diary");
const validateParams = require("../middlewares/validateParams");

const router = express.Router();

router.get(
  "/:date",
  authentificate,
  validateDate,
  validateParams(schemas.getDiarySchemaParams),
  ctrl.diaryByDate
);
router.post(
  "/exercise",
  authentificate,
  validateDate,
  validateBody(schemas.addExerciseSchema),
  ctrl.postExerciseToDiary);
router.post(
  "/product",
  authentificate,
  validateDate,
  validateBody(schemas.addProductSchema),
  ctrl.postProductsToDiary);
router.delete("/product", authentificate, ctrl.deleteProductsFromDiary);
router.delete("/exercise", authentificate, ctrl.deleteProductsFromDiary);

module.exports = router;
