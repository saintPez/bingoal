import ValidationError from 'lib/error/validation'
import ValidationErrors from 'lib/error/validations'

export default function Throw(validationErrors: ValidationError[]): void {
  if (validationErrors.length === 1)
    throw new ValidationError(
      validationErrors[0].value,
      validationErrors[0].param,
      validationErrors[0].type
    )
  else {
    let message: string
    for (const validationError of validationErrors) {
      message += `${validationError.message} \n`
    }
    throw new ValidationErrors(message, validationErrors)
  }
}
