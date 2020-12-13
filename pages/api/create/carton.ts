import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import Carton, { ICarton } from 'models/Carton';
import { initMiddleware, validate } from 'utils/middleware';
import tokenValidation from 'validation/token.validation';
import cartonValidation from 'validation/create/carton.validation';
import createCarton from 'libs/create/carton';

const validateAuth = initMiddleware(validate(tokenValidation));
const validateReq = initMiddleware(validate(cartonValidation));
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
                    const data = await createCarton();
                    req.body.data = data;
                }

                const carton: ICarton = new Carton({
                    data: req.body.data
                });

                const newCarton = await carton.save();

                res.status(200).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newCarton
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
