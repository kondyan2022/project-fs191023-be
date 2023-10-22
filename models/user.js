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
      // validate: {
      //   validator: function (v) {
      //     console.log("Check birthdate");
      //     return true;
      //   },
      //   message: (props) => `${props.value} is not valid`,
      // },
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

// function checkBirthday(birthday) {
//   {
//     console.log("Test value", birthday);
//     const checkDate = birthday.setFullYear(birthday.getFullYear() + 18);
//     const nowDate = new Date();
//     // return nowDate >= checkDate;
//     return false;
//   }
// }

const userSchema = new Schema(
  {
    name: {
      type: String,
      validate: {
        validator: function (v) {
          console.log("Check name", v);
          return v.length > 4;
        },
        message: (props) => `${props.value} is not valid`,
      },
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
  profile: Joi.object().keys({
    height: Joi.number().min(150).required(),
    currentWeight: Joi.number().min(35).required(),
    desiredWeight: Joi.number().min(35).required(),
    birthday: Joi.date()
      .required()
      .custom((value, helper) => {
        const checkDate = value.setFullYear(value.getFullYear() + 18);
        const nowDate = new Date();
        if (nowDate < checkDate) {
          return helper.message(`Must be at least 18, got ${value}!`);
        }
        return true;
      }),
    blood: Joi.number().valid(1, 2, 3, 4).required(),
    sex: Joi.number().valid("male", "female").required(),
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
