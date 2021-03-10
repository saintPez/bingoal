import Joi from 'joi'

export default Joi.object({
  card: Joi.string().required(),
})
