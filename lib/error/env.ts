export default class EnvError extends Error {
  constructor(env: string) {
    super(`${env} is not defined`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvError)
    }

    this.name = 'EnvError'
  }
}
