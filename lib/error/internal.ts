export default class InternalError extends Error {
  msg: string
  type: string

  constructor(type: 'ENV', message: string) {
    if (type === 'ENV') super(`${message} is not defined`)
    else super(`${message}`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalError)
    }

    this.name = 'InternalError'
    this.type = type
    this.msg = this.message
  }
}
