import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import Card, { ICard } from 'models/Card';
import Game, { IGame } from 'models/Game';
import { initMiddleware, validate } from 'utils/middleware';
import tokenValidation from 'validation/token.validation';
import gameValidation from 'validation/create/game.validation';

const validateAuth = initMiddleware(validate(tokenValidation));
const validateReq = initMiddleware(validate(gameValidation));
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

                if (req.body.gameDate === undefined) {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    date.setHours(14);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    req.body.gameDate = date;
                }

                const cards: ICard[] = await Card.find({});

                const game: IGame = new Game({
                    played: false,
                    playing: false,
                    cards: cards,
                    purchasedCards: [],
                    balls: [],
                    winningCartons: [],
                    gameDate: req.body.gameDate
                });

                const newGame = await game.save();

                res.status(201).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newGame
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
