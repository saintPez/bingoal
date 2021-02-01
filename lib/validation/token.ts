import validator from 'validator'

import Throw from './throw'
import ValidationError from 'lib/error/validation'

export default function validate(token: string): void {
  const validationErrors: ValidationError[] = []

  if (typeof token !== 'string')
    throw new ValidationError(token, 'token', 'Token must be a string')

  if (!validator.isJWT(token))
    validationErrors.push(
      new ValidationError(token, 'token', 'Token is not a valid token')
    )

  if (validationErrors.length) Throw(validationErrors)
}
