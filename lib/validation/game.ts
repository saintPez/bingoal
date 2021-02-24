import Joi from 'joi'

export default Joi.object({
  game_date: Joi.number().min(new Date().getTime()),
})
