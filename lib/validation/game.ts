import Joi from 'joi'

export default Joi.object({
  played: Joi.boolean(),
  playing: Joi.boolean(),
  game_date: Joi.number().min(new Date().getTime()),
})
