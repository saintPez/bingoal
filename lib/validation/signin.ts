import Joi from 'joi'

export default Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
})
