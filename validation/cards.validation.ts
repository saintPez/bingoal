import { checkSchema, ValidationChain } from 'express-validator'

const cardsValidation: ValidationChain[] = checkSchema({
  game: {
    optional: true,
    isString: {
      errorMessage: 'Game must be a string'
    }
  }
})

export default cardsValidation
