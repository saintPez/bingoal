import { checkSchema, ValidationChain } from 'express-validator';

const loginValidation: ValidationChain[] = checkSchema({
    email: {
        isEmail: {
            errorMessage: 'email must be a valid email'
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'password must be at least 8 characters'
        }
    }
});

export default loginValidation;
