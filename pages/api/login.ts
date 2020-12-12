import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import jwt, { Secret } from 'jsonwebtoken';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import loginValidation from 'validation/login.validation';

const validateReq = initMiddleware(validate(loginValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await validateReq(req, res);
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

                const token: Secret = await jwt.sign(
                    { _id: user._id },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: 60 * 60 * 24
                    }
                );

                res.status(200).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: user,
                            token: token,
                            param: 'token'
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
