const express = require("express");

const { authentificate, validateQuery } = require("../middlewares");
const ctrl = require("../controllers/exercises");
const { schemas } = require("../models/exercises");

const router = express.Router();

router.get("/", authentificate, ctrl.getExercises);
router.get("/exercisegroups", authentificate, ctrl.getExerciseGroups);
router.get(
  "/search",
  authentificate,
  validateQuery(schemas.getExercisesSearchQuery),
  ctrl.getExercisesSearch
);
module.exports = router;
