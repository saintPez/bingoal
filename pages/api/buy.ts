import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import Carton, { ICarton } from 'models/Carton';
import { initMiddleware, validate } from 'utils/middleware';
import tokenValidation from 'validation/token.validation';

const validateAuth = initMiddleware(validate(tokenValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await validateAuth(req, res);
                const user: IUser = await User.findById(req.body._id);
                if (!user)
                    throw {
                        value: req.body._id,
                        msg: 'user not found',
                        param: '_id',
                        location: 'body'
                    };

                const carton: ICarton = await Carton.findOne();
                
                await user.update({
                    $push: {
                        tempPurchasedCartons: carton._id
                    }
                })
                  

                res.status(200).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: ''
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
