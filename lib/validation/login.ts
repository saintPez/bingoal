import validator from 'validator'

import Throw from './throw'
import ValidationError from 'lib/error/validation'

export default function validate(email: string, password: string): void {
  const validationErrors: ValidationError[] = []

  if (!validator.isEmail(email))
    validationErrors.push(
      new ValidationError(email, 'Email', 'Email is not a valid email')
    )
  if (!validator.isStrongPassword(password, { minSymbols: 0, minNumbers: 0 }))
    validationErrors.push(
      new ValidationError(
        password,
        'Password',
        'Password is not a strong password'
      )
    )

  if (validationErrors.length) Throw(validationErrors)
}
