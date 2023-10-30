const express = require("express");
const ctrl = require("../controllers/users");
const {
  validateBody,
  resizeAvatar,
  isSingleFileExist,
  authentificate,
  upload,
} = require("../middlewares");
const { schemas } = require("../models/user");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.registration
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authentificate, ctrl.getCurrent);

// router.post(
//   "/verify",
//   validateBody(schemas.verifySchema),
//   ctrl.sendVerificationToken
// );
// router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/logout", authentificate, ctrl.logout);
router.patch(
  "/avatars",
  authentificate,
  upload.single("avatar"),
  isSingleFileExist,
  // resizeAvatar,
  ctrl.updateAvatar
);

router.put(
  "/",
  authentificate,
  validateBody(schemas.updateSchema),
  ctrl.updateProfile
);

router.get("/google", ctrl.googleAuth);

router.get("/google-redirect", ctrl.googleRedirect);

module.exports = router;
