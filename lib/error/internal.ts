export default class InternalError extends Error {
  type: string
  status: number

  constructor(type: 'ENV', message: string, status?: number) {
    if (type === 'ENV') super(`${message} is not defined`)
    else super(`${message}`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalError)
    }

    this.name = 'InternalError'
    this.type = type
    this.status = status || 500
  }
}
