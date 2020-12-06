import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import SignInValidation from 'validation/singin.validation';

const middleware = initMiddleware(validate(SignInValidation));

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await middleware(req, res);
                const user: IUser = await User.findOne({
                    email: req.body.email
                });
                if (!user)
                    throw {
                        value: req.body.email,
                        msg: 'email is not correct',
                        param: 'email',
                        location: 'body'
                    };

                const correctPassword: boolean = await user.validatePassword(
                    req.body.password
                );
                if (!correctPassword)
                    throw {
                        value: req.body.password,
                        msg: 'password is not correct',
                        param: 'password',
                        location: 'body'
                    };

                res.status(201).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: user
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
