const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const {
  HttpError,
  ctrlWrapper,
  // sendEmail,
  // sendEmailElastic,
} = require("../helpers");
const jwt = require("jsonwebtoken");
const gavatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_BASE_URLURL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registration = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gavatar.url(email);
  const verificationToken = nanoid(); // Токен при verify = true не має значення
  const verify = true; //Email - вважаємо перевірено при створенні

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken,
    verify,
  });

  // const verifyEmail = {
  //   to: email,
  //   subject: "verify email",
  //   html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  // };

  //await sendEmail(verifyEmail);
  //await sendEmailElastic(verifyEmail);

  const payload = { id: newUser._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: { email: newUser.email, avatarURL },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email, avatarURL: user.avatarURL },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verification successful" });
};

const sendVerificationToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(400, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const { verificationToken } = user;
  const verifyEmail = {
    to: email,
    subject: "verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  // await sendEmail(verifyEmail);
  await sendEmailElastic(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const getCurrent = (req, res) => {
  const { email } = req.user;
  res.json({ email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.sendStatus(204);
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json({ email: user.email });
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    fs.unlink(tempUpload);
    next(error);
  }
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  registration: ctrlWrapper(registration),
  login: ctrlWrapper(login),
  verifyEmail: ctrlWrapper(verifyEmail),
  sendVerificationToken: ctrlWrapper(sendVerificationToken),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
