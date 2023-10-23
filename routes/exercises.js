const express = require("express");

const { authentificate } = require("../middlewares");
const ctrl = require("../controllers/exercises");

const router = express.Router();

router.get("/", authentificate, ctrl.getExercises);
router.get("/exercisegroups", authentificate, ctrl.getExerciseGroups);
module.exports = router;
