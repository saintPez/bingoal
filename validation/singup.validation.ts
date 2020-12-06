import User from 'models/User';
import { checkSchema, ValidationChain } from 'express-validator';

const SignUpValidation: ValidationChain[] = checkSchema({
    username: {
        isLength: {
            options: {
                min: 4
            },
            errorMessage: 'email must be at least 4 characters'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'invalid email'
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) return Promise.reject('email already in use');
            }
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'password must be at least 8 characters'
        }
    },
    dateOfBirth: {
        isDate: {
            errorMessage: 'dateOfBirth should be type Date'
        }
    }
});

export default SignUpValidation;