const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  phoneNumber: Joi.string().required().messages({
    "string.empty": "Phone number is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
  }),
  pin: Joi.string().optional(), // Pin is optional
});

module.exports = { createUserSchema };
