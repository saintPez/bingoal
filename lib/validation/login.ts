import validator from 'validator'

import Throw from './throw'
import ValidationError from 'lib/error/validation'

export default function validate(email: string, password: string): void {
  const validationErrors: ValidationError[] = []
  if (!validator.isEmail(email))
    validationErrors.push(
      new ValidationError(email, 'Email', 'must be a valid email')
    )
  if (!validator.isStrongPassword(password))
    validationErrors.push(
      new ValidationError(password, 'Password', 'must be a valid password')
    )
  Throw(validationErrors)
}
