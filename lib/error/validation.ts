export default class ValidationError extends Error {
  value: unknown
  param: string
  msg: string

  constructor(value: unknown, param: string, message: string) {
    super(`${param} ${message}`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    this.name = 'ValidationError'
    this.value = value
    this.param = param
    this.msg = message
  }
}
