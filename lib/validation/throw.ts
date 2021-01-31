import ValidationError from 'lib/error/validation'
import ValidationErrors from 'lib/error/validations'

export default function Throw(validationErrors: ValidationError[]): void {
  if (validationErrors.length === 1)
    throw new ValidationErrors(
      `${validationErrors[0].message} \n`,
      validationErrors
    )
  else {
    let message = ''
    for (const validationError of validationErrors) {
      message += `${validationError.message} \n`
    }
    throw new ValidationErrors(message, validationErrors)
  }
}
