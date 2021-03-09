export default class BingoalError extends Error {
  status: number

  constructor(message: string, status?: number) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BingoalError)
    }

    this.name = 'BingoalError'
    this.status = status || 404
  }
}
