import ValidationError from './validation'

export default class ValidationErrors extends Error {
  errors: ValidationError[]

  constructor(message: string, errors: ValidationError[]) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationErrors)
    }

    this.name = 'ValidationErrors'
    this.errors = errors
  }
}
