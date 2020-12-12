import { checkSchema, ValidationChain } from 'express-validator';

const gameValidation: ValidationChain[] = checkSchema({
    gameDate: {
        isDate: {
            errorMessage: 'gameDate should be a date'
        }
    }
});

export default gameValidation;
