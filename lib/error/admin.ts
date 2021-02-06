export default class AdminError extends Error {
  msg: string
  status: number

  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdminError)
    }

    this.name = 'AdminError'
    this.msg = this.message
    this.status = 403
  }
}
