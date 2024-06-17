import Joi from 'joi';

export const signupSchema = Joi.object({
  fist_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  bvn: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required().trim()
});

export const signinSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().trim()
});
