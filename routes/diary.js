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
  validateParams(schemas.getDiarySchemaParams),
  ctrl.diaryByDate
);
router.post(
  "/exercise",
  authentificate,
  validateBody(schemas.addExerciseSchema),
  ctrl.postExerciseToDiary);
router.post(
  "/product",
  authentificate,
  validateBody(schemas.addProductSchema),
  ctrl.postProductsToDiary);
router.delete("/product", authentificate, ctrl.deleteProductsFromDiary);

module.exports = router;
