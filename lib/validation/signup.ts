import validator from 'validator'

import Throw from './throw'
import ValidationError from 'lib/error/validation'

export default function validate(
  name: string,
  email: string,
  password: string,
  birth_date: Date,
  time_zone?: string
): void {
  const validationErrors: ValidationError[] = []

  if (typeof name !== 'string')
    throw new ValidationError(name, 'name', 'Name must be a string')
  if (typeof email !== 'string')
    throw new ValidationError(email, 'email', 'Email must be a string')
  if (typeof password !== 'string')
    throw new ValidationError(password, 'password', 'Password must be a string')
  if (typeof birth_date !== 'number')
    throw new ValidationError(
      birth_date,
      'birth_date',
      'Birth date must be a number'
    )
  if (!time_zone && typeof time_zone !== 'string')
    throw new ValidationError(
      time_zone,
      'time_zone',
      'Time zone must be a string'
    )

  if (!validator.isLength(name, { min: 3 }))
    validationErrors.push(
      new ValidationError(
        name,
        'name',
        'Name must be at least 3 characters long'
      )
    )

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
