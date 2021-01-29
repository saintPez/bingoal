export default class MethodError extends Error {
  msg: string

  constructor(method: string) {
    super(`Method ${method} is invalid`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodError)
    }

    this.name = 'MethodError'
    this.msg = this.message
  }
}
