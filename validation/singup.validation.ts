import User from 'models/User';
import { checkSchema, ValidationChain } from 'express-validator';

const SignUpValidation: ValidationChain[] = checkSchema({
    nickname: {
        isString: {
            errorMessage: 'nickname must be a string'
        },
        isLength: {
            options: {
                min: 4,
            },
            errorMessage: 'nickname must be at least 4 characters'
        }
    },
    firstname: {
        isString: {
            errorMessage: 'firstname must be a string'
        },
        isLength: {
            options: {
                min: 4
            },
            errorMessage: 'firstname must be at least 4 characters'
        }
    },
    lastname: {
        isString: {
            errorMessage: 'lastname must be a string'
        },
        isLength: {
            options: {
                min: 4
            },
            errorMessage: 'lastname must be at least 4 characters'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'email must be a valid email'
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) return Promise.reject('email already in use');
            }
        }
    },
    password: {
        isString: {
            errorMessage: 'password must be a string'
        },
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'password must be at least 8 characters'
        }
    },
    dateOfBirth: {
        isDate: {
            errorMessage: 'dateOfBirth should be a date'
        }
    }
});

export default SignUpValidation;