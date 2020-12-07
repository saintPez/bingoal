import { checkSchema, ValidationChain } from 'express-validator';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

const TokenValidation: ValidationChain[] = checkSchema({
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

export default TokenValidation;

/*import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface IPayload {
    _id: string,
    iat: number,
    exp: number,
}

export const TokenValidation = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = (res.getHeader('token') as string);
        if (!token) return res.status(401).json({ status: 401, error: 'Access denied' });
        const payload = await jwt.verify(token, 'token') as IPayload;
        req.body.user_id = payload._id;
        
    }
    catch (error) {
        res.status(400).send({ status: 400, error: error });
    }
}*/
