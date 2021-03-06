import { checkSchema, ValidationChain } from 'express-validator'

const registerValidation: ValidationChain[] = checkSchema({
  nickname: {
    isString: {
      errorMessage: 'Nickname must be a string'
    },
    isLength: {
      options: {
        min: 4
      },
      errorMessage: 'Nickname must be at least 4 characters'
    }
  },
  firstname: {
    isString: {
      errorMessage: 'Firstname must be a string'
    },
    isLength: {
      options: {
        min: 4
      },
      errorMessage: 'Firstname must be at least 4 characters'
    }
  },
  lastname: {
    isString: {
      errorMessage: 'Lastname must be a string'
    },
    isLength: {
      options: {
        min: 4
      },
      errorMessage: 'Lastname must be at least 4 characters'
    }
  },
  email: {
    isEmail: {
      errorMessage: 'Email must be a valid email'
    }
  },
  password: {
    isString: {
      errorMessage: 'Password must be a string'
    },
    isLength: {
      options: {
        min: 8
      },
      errorMessage: 'Password must be at least 8 characters'
    }
  },
  dateOfBirth: {
    isDate: {
      errorMessage: 'Date Of Birth should be a date'
    }
  }
})

export default registerValidation
