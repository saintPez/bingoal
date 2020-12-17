import { checkSchema, ValidationChain } from 'express-validator';

const playValidation: ValidationChain[] = checkSchema({
    game: {
        optional: true,
        isString: {
            errorMessage: 'game must be a string'
        }
    }
});

export default playValidation;
