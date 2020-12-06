import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import SignUpValidation from 'validation/singup.validation';

const middleware = initMiddleware(validate(SignUpValidation));

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await middleware(req, res);
                const user: IUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    dateOfBirth: req.body.dateOfBirth,
                    admin: false
                });
                user.password = await user.encryptPassword(user.password);
                const newUser = await user.save();
                res.status(201).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newUser
                        },
                        null,
                        4
                    )
                );
                break;
            }
            default:
                res.status(400).json(
                    JSON.stringify(
                        {
                            success: false,
                            error: `method '${req.method}' is invalid`
                        },
                        null,
                        4
                    )
                );
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
