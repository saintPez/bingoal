import { NextApiRequest, NextApiResponse } from 'next';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
    return async (req: NextApiRequest, res: NextApiResponse, next) => {
        await Promise.all(
            validations.map((validation: ValidationChain) =>
                validation.run(req)
            )
        );

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(422).json({ succes: false, error: errors.array() });
    };
};

export const initMiddleware = (middleware) => {
    return (req: NextApiRequest, res: NextApiResponse) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}

/*
export default function validateMiddleware(validations, validationResult) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(422).json({ errors: errors.array() })
  }
}
*/
