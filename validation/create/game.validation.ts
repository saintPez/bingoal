import { checkSchema, ValidationChain } from 'express-validator';

const gameValidation: ValidationChain[] = checkSchema({
    gameDate: {
        optional: true,
        isDate: {
            errorMessage: 'gameDate should be a date'
        }
    }
});

export default gameValidation;
