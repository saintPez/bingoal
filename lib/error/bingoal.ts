export default class BingoalError extends Error {
  status: number

  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BingoalError)
    }

    this.name = 'BingoalError'
    this.status = 404
  }
}
