import validator from 'validator'

import Throw from 'lib/validation/throw'
import ValidationError from 'lib/error/validation'

export default function validate(email: string, password: string): void {
  const validationErrors: ValidationError[] = []

  if (typeof email !== 'string')
    throw new ValidationError(email, 'email', 'Email must be a string')

  if (typeof password !== 'string')
    throw new ValidationError(password, 'password', 'Password must be a string')

  if (!validator.isEmail(email))
    validationErrors.push(
      new ValidationError(email, 'email', 'Email is not a valid email')
    )

  if (
    !validator.isStrongPassword(password, {
      minSymbols: 0,
      minNumbers: 0,
    })
  )
    validationErrors.push(
      new ValidationError(
        password,
        'password',
        'Password is not a strong password'
      )
    )

  if (validationErrors.length) Throw(validationErrors)
}
