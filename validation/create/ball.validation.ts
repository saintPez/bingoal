import { checkSchema, ValidationChain } from 'express-validator'

const ballValidation: ValidationChain[] = checkSchema({
  game: {
    optional: true,
    isString: {
      errorMessage: 'game must be a string'
    }
  }
})

export default ballValidation
