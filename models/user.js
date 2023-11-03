const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const profileSchema = new Schema(
  {
    height: {
      type: Number,
      min: [150, "Must be at least 150, got {VALUE}!"],
      required: true,
    },
    currentWeight: {
      type: Number,
      min: [35, "Must be at least 35, got {VALUE}!"],
      required: true,
    },
    desiredWeight: {
      type: Number,
      min: [35, "Must be at least 35, got {VALUE}!"],
      required: true,
    },
    birthday: {
      type: Date,
      validate: {
        validator: function (v) {
          const checkDate = new Date(v);
          checkDate.setFullYear(checkDate.getFullYear() + 18);
          const nowDate = new Date();
          return nowDate >= checkDate;
        },
        message: (props) => `${props.value} is not valid`,
      },
      required: true,
    },
    blood: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    levelActivity: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    DSN: {
      type: Number,
      default: 110,
    },
  },
  {
    _id: false,
    toJSON: { virtuals: true },
    virtuals: {
      BMR: {
        get() {
          const age = Math.floor(
            (new Date() - this.birthday) / (1000 * 60 * 60 * 24 * 365)
          );
          return Math.round(
            (10 * this.currentWeight +
              6.25 * this.height -
              5 * age +
              (this.sex === "male" ? 5 : -160)) *
              this.levelActivity
          );
        },
      },
    },
  }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //
      //     return v.length > 4;
      //   },
      //   message: (props) => `${props.value} is not valid`,
      // },
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: String,
    token: String,
    googleRedirected: { type: Boolean, default: false },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    profile: {
      type: profileSchema,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

userSchema.pre("findOneAndUpdate", function (next) {
  const { profile } = this.getUpdate();

  if (profile) {
    const birthday = new Date(profile.birthday);
    birthday.setFullYear(birthday.getFullYear() + 18);
    const nowDate = new Date();
    if (nowDate < birthday) {
      return next(
        new Error(
          `Age must be at least 18 years old, got birth date ${new Date(
            profile.birthday
          ).toLocaleDateString()}`
        )
      );
    }
  }
  next();
});

const User = model("user", userSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
}).messages({ "any.required": "missing required field email" });

const updateSchema = Joi.object({
  name: Joi.string().min(2),
  // password: Joi.string().min(6),
  // email: Joi.string().email(),
  avatarURL: Joi.string(),
  profile: Joi.object().keys({
    height: Joi.number().min(150).required(),
    currentWeight: Joi.number().min(35).required(),
    desiredWeight: Joi.number().min(35).required(),
    birthday: Joi.date()
      .required()
      .custom((value, helper) => {
        const checkDate = new Date(value);
        checkDate.setFullYear(value.getFullYear() + 18);
        const nowDate = new Date();
        if (nowDate < checkDate) {
          return helper.message(
            `Age must be at least 18 years old, got birth date ${new Date(
              value
            ).toLocaleDateString()}`
          );
        }
        return true;
      }),
    blood: Joi.number().valid(1, 2, 3, 4).required(),
    sex: Joi.string().valid("male", "female").required(),
    levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
  }),
});

// height - number; minimum 150(cm); required
// currentWeight - number; minimum 35(kg); required
// desiredWeight - number; minimum 35(kg); required
// birthday - date; must be older than 18 years;  required
// blood - number; allowed values 1, 2, 3, 4; required
// sex - string; allowed values "male", "female"; required
// levelActivity - number; allowed values 1, 2, 3, 4, 5; required

const schemas = {
  registerSchema,
  loginSchema,
  verifySchema,
  updateSchema,
};

module.exports = { User, schemas };
