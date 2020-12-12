import { checkSchema, ValidationChain } from 'express-validator';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

const tokenValidation: ValidationChain[] = checkSchema({
    token: {
        isString: {
            errorMessage: 'token must be a string'
        },
        custom: {
            options: async (value, root) => {
                try {
                    const payload = (await jwt.verify(
                        value,
                        process.env.TOKEN_SECRET
                    )) as IPayload;
                    root.req.body._id = payload._id;
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        }
    }
});

export default tokenValidation;
