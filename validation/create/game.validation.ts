import { checkSchema, ValidationChain } from 'express-validator'

const gameValidation: ValidationChain[] = checkSchema({
  gameDate: {
    optional: true,
    isDate: {
      errorMessage: 'Game Date should be a date'
    }
  }
})

export default gameValidation
