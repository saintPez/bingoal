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
                    return res.status(400).json(
                        JSON.stringify(
                            {
                                success: false,
                                error: 'email is not correct'
                            },
                            null,
                            4
                        )
                    );

                const correctPassword: boolean = await user.validatePassword(
                    req.body.password
                );
                if (!correctPassword)
                    return res.status(400).json(
                        JSON.stringify(
                            {
                                success: false,
                                error: 'password is not correct'
                            },
                            null,
                            4
                        )
                    );

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
