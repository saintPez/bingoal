export default class MethodError extends Error {
  constructor(method: string) {
    super(`Method ${method} is invalid`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MethodError)
    }

    this.name = 'MethodError'
  }
}
