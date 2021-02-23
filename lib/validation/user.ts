import Joi from 'joi'

export default Joi.object({
  name: Joi.string().min(3),
  avatar_url: Joi.string(),
  'email.private': Joi.boolean,
  'email.data': Joi.string().email(),
  password: Joi.string().min(8),
  'birth_date.private': Joi.boolean(),
  'birth_date.data': Joi.number(),
  'time_zone.private': Joi.boolean(),
  'time_zone.data': Joi.string(),
  language: Joi.string(),
  verified: Joi.boolean(),
  baned: Joi.boolean(),
  admin: Joi.boolean(),
})
