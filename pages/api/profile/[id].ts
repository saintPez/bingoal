import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import TokenValidation from 'validation/token.validation';

const validateAuth = initMiddleware(validate(TokenValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'GET': {
                await dbConnect();
                await validateAuth(req, res);
                try {
                    const user: IUser = await User.findOne({
                        _id: req.query.id
                    });
                    res.status(200).json(
                        JSON.stringify(
                            {
                                success: true,
                                data: user
                            },
                            null,
                            4
                        )
                    );
                } catch (error) {
                    throw [
                        {
                            value: req.query.id,
                            msg: 'user not found',
                            param: 'id',
                            location: 'query'
                        }
                    ];
                }
                break;
            }
            default:
                throw [{ value: req.method, msg: `method is invalid` }];
        }
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
