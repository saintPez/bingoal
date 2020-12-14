import { checkSchema, ValidationChain } from 'express-validator';

const gameValidation: ValidationChain[] = checkSchema({
    data: {
        optional: true,
        isArray: {
            errorMessage: 'data should be a array'
        },
        isLength: {
            options: {
                min: 25,
                max: 25
            },
            errorMessage: 'data must be at least 25 characters'
        }
    }
});

export default gameValidation;
