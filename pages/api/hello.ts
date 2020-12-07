import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'utils/dbConnect';
import { initMiddleware, validate } from 'utils/middleware';
import TokenValidation from 'validation/token.validation';

const middleware = initMiddleware(validate(TokenValidation));

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        await middleware(req, res);
        res.json({_id: req.body._id});
    } catch (error) {
        res.status(400).json(
            JSON.stringify(
                {
                    success: false,
                    error: error
                },
                null,
                4
            )
        );
    }
};
