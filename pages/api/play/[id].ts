import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import Game, { IGame } from 'models/Game';
import User, { IUser } from 'models/User';
import { initMiddleware, validate } from 'utils/middleware';
import playValidation from 'validation/play.validation';
import tokenValidation from 'validation/token.validation';

const validateReq = initMiddleware(validate(playValidation));
const validateAuth = initMiddleware(validate(tokenValidation));
const middlewareCors = initMiddleware(cors());

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await middlewareCors(req, res);
        switch (req.method) {
            case 'GET': {
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

                const game: IGame = await Game.findOne({
                    _id: req.query.id || req.body.game
                });
                if (!game)
                    throw {
                        value: req.body.game,
                        msg: 'game not found',
                        param: '_id',
                        location: 'database'
                    };

                if (game.gameDate > new Date())
                    throw {
                        value: game.gameDate,
                        msg: 'game has not started yet',
                        param: 'gameDate',
                        location: 'database'
                    };

                if (!game.played)
                    throw {
                        value: game.played,
                        msg: 'game has already been played',
                        param: 'played',
                        location: 'database'
                    };

                if (game.playing)
                    throw {
                        value: game.playing,
                        msg: 'game is playing',
                        param: 'playing',
                        location: 'database'
                    };

                game.updateOne({ playing: true });

                res.status(200).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: game
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
