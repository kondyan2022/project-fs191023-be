const express = require("express");
const {
  authentificate,
  validateBody,
  validateQuery,
  isUserHaveProfile,
  validateAndConvertDateBody,
} = require("../middlewares");
const ctrl = require("../controllers/diary");
const { schemas } = require("../models/diary");
const validateParams = require("../middlewares/validateParams");

const router = express.Router();

router.get(
  "/:date",
  authentificate,
  isUserHaveProfile,
  validateParams(schemas.getDiarySchemaParams),
  ctrl.diaryByDate
);
router.post(
  "/exercise",
  validateAndConvertDateBody,
  authentificate,
  isUserHaveProfile,
  validateBody(schemas.addExerciseSchema),
  ctrl.postExerciseToDiary
);
router.post(
  "/product",
  validateAndConvertDateBody,
  authentificate,
  isUserHaveProfile,
  validateBody(schemas.addProductSchema),
  ctrl.postProductsToDiary
);
router.delete(
  "/product",
   validateAndConvertDateBody,
  authentificate,
  isUserHaveProfile,
  ctrl.deleteProductsFromDiary
);

router.delete(
  "/product",
   validateAndConvertDateBody,
  authentificate,
  isUserHaveProfile,
  ctrl.deleteProductsFromDiary
);

module.exports = router;
