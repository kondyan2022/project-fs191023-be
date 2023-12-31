const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const {
  HttpError,
  ctrlWrapper,
  // sendEmail,
  // sendEmailElastic,
} = require("../helpers");
const jwt = require("jsonwebtoken");
// const gavatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const queryString = require("query-string");
const axios = require("axios");

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfhl9z7ez/image/upload/v1698618013/avatars/noavatar.png";
const { SECRET_KEY, BASE_URL } = process.env;

// const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registration = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = DEFAULT_AVATAR;
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
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarURL,
      createdAt: newUser.createdAt,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
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
  user = await User.findByIdAndUpdate(
    user._id,
    { token, googleRedirected: false },
    {
      new: true,
      select:
        "-updatedAt -password -token -verify -verificationToken -googleRedirected",
    }
  );
  res.json({
    token,
    // user: { email: user.email, avatarURL: user.avatarURL },
    user,
  });
};

const googleLogin = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  user = await User.findByIdAndUpdate(
    user._id,
    { token, googleRedirected: false },
    {
      new: true,
      select:
        "-updatedAt -password -token -verify -verificationToken -googleRedirected",
    }
  );
  res.json({
    token,
    user,
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
  const { _id, name, email, avatarURL, profile, createdAt } = req.user;
  res.json({ _id, name, email, avatarURL, profile, createdAt });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.sendStatus(204);
};

// const updateUser = async (req, res) => {
//   const { _id } = req.user;
//   const user = await User.findByIdAndUpdate(_id, req.body, {
//     new: true,
//     select: "-createdAt -updatedAt",
//   });
//   res.json(user);
// };

// const updateAvatar = async (req, res, next) => {
//   const { _id } = req.user;
//   const { path: tempUpload, originalname } = req.file;
//   const filename = `${_id}_${originalname}`;
//   const resultUpload = path.join(avatarsDir, filename);
//   try {
//     await fs.rename(tempUpload, resultUpload);
//   } catch (error) {
//     fs.unlink(tempUpload);
//     next(error);
//   }
//   const avatarURL = path.join("avatars", filename);
//   await User.findByIdAndUpdate(_id, { avatarURL });
//   res.json({ avatarURL });
// };

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const avatarURL = req.file.path;
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    select:
      "-updatedAt -password -token -verify -verificationToken -googleRedirected",
  });
  res.json(user);
};

const googleAuth = async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/users/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/users/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  const { email, name, picture } = userData.data;
  let user = await User.findOne({ email });
  if (!user) {
    const hashPassword = await bcrypt.hash(nanoid(), 10);
    const avatarURL = picture;
    const verificationToken = nanoid(); // Токен при verify = true не має значення
    const verify = true; //Email - вважаємо перевірено при створенні

    user = await User.create({
      name,
      email,
      avatarURL,
      password: hashPassword,
      verificationToken,
      verify,
    });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token, googleRedirected: true });

  return res.redirect(`${process.env.FRONTEND_URL}/googlelogin?email=${email}`);
  res.json(userData.data);
};

module.exports = {
  registration: ctrlWrapper(registration),
  login: ctrlWrapper(login),
  verifyEmail: ctrlWrapper(verifyEmail),
  sendVerificationToken: ctrlWrapper(sendVerificationToken),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateProfile: ctrlWrapper(updateProfile),
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
  googleLogin: ctrlWrapper(googleLogin),
};
