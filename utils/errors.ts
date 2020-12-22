interface IValidationError {
  value: any;
  message: string;
  param: string;
  location: string;
}

export class ValidationError extends Error {
  value: any;
  param: string;
  location: string;

  constructor (options: IValidationError) {
    super(options.message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }

    this.name = 'ValidationError'
    this.value = options.value
    this.param = options.param
    this.location = options.location
  }
}
