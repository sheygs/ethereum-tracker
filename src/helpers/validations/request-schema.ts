import Joi from 'joi';
import { UnprocessableEntityException } from '../error';

const passwordRegex = /^[a-zA-Z0-9]{3,30}$/;

const signUpSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).regex(passwordRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).regex(passwordRegex).required(),
});

export const bearerTokenSchema: Joi.ObjectSchema<any> = Joi.object()
  .keys({
    authorization: Joi.string()
      .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required()
      .error(new UnprocessableEntityException('Invalid bearer token.')),
  })
  .unknown(true);

export { signUpSchema, loginSchema };
