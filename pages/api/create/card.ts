import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import Card, { ICard } from 'models/Card';
import { initMiddleware, validate } from 'utils/middleware';
import tokenValidation from 'validation/token.validation';
import cardValidation from 'validation/create/card.validation';
import createCard from 'libs/create/card';

const validateAuth = initMiddleware(validate(tokenValidation));
const validateReq = initMiddleware(validate(cardValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await validateAuth(req, res);
                await validateReq(req, res);
                const user: IUser = await User.findById(req.body._id);
                if (!user)
                    throw {
                        value: req.body._id,
                        msg: 'user not found',
                        param: '_id',
                        location: 'body'
                    };

                if (!user.admin)
                    throw {
                        value: user.admin,
                        msg: 'user is not admin',
                        param: 'admin',
                        location: 'database'
                    };

                if (req.body.data === undefined) {
                    const data = await createCard();
                    req.body.data = data;
                }

                const card: ICard = new Card({
                    data: req.body.data
                });

                const newCard = await card.save();

                res.status(200).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newCard
                        },
                        null,
                        4
                    )
                );
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
