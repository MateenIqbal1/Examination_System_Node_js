const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().required()
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  signupSchema,
  signinSchema,
};
