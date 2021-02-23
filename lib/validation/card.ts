import Joi from 'joi'

export default Joi.object({
  data: Joi.array().min(25).max(25),
})
