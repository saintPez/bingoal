import User from 'models/User';
import { checkSchema, ValidationChain } from 'express-validator';

export const SignUpValidation: ValidationChain[] = checkSchema({
    username: {
        isLength: {
            options: {
                min: 4
            },
            errorMessage: 'Username should be at least 4 chars long'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Invalid email'
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) return Promise.reject('Email already in use');
            }
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'Password should be at least 8 chars long'
        }
    },
    dateOfBirth: {
        isDate: {
            errorMessage: 'dateOfBirth should be type Date'
        }
    },
    admin: {
        optional: true,
        isBoolean: {
            errorMessage: 'admin should be type boolean'
        }
    }
});

export const SignInValidation: ValidationChain[] = checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Invalid email'
        },
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (!user) return Promise.reject('No email found');
            }
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'Invalid password'
        }
    }
});
