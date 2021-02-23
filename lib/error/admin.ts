export default class AdminError extends Error {
  status: number

  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdminError)
    }

    this.name = 'AdminError'
    this.status = 403
  }
}
