import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import jwt, { Secret } from 'jsonwebtoken';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import registerValidation from 'validation/register.validation';

const validateReq = initMiddleware(validate(registerValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'POST': {
                await dbConnect();
                await validateReq(req, res);

                const pads = '0000';
                const hash = (
                    await User.countDocuments({
                        nickname: req.body.nickname
                    })
                ).toString();

                const user: IUser = new User({
                    nickname: req.body.nickname,
                    hash: pads.substring(0, pads.length - hash.length) + hash,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    dateOfBirth: req.body.dateOfBirth,
                    admin: true
                });

                user.password = await user.encryptPassword(user.password);
                const newUser = await user.save();
                const token: Secret = await jwt.sign(
                    { _id: newUser._id },
                    process.env.TOKEN_SECRET,
                    {
                        // expiresIn: 60 * 60 * 24
                    }
                );
                res.status(201).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newUser,
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
