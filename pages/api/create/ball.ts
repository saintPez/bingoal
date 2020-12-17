import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import User, { IUser } from 'models/User';
import Game, { IGame } from 'models/Game';
import PurchasedCard, { IPurchasedCard } from 'models/purchasedCard';
import { initMiddleware, validate } from 'utils/middleware';
import tokenValidation from 'validation/token.validation';
import ballValidation from 'validation/create/ball.validation';
import createBalls from 'libs/create/balls';

const validateAuth = initMiddleware(validate(tokenValidation));
const validateReq = initMiddleware(validate(ballValidation));
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

                let game: IGame = await Game.findOne(
                    req.body.game ? { _id: req.body.game } : {}
                )
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'user'
                        }
                    })
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'card'
                        }
                    });

                if (!game)
                    throw {
                        value: req.body.game,
                        msg: 'game not found',
                        param: '_id',
                        location: 'database'
                    };

                if (game.played)
                    throw {
                        value: game.played,
                        msg: 'game has already been played',
                        param: 'played',
                        location: 'database'
                    };

                if (!game.playing)
                    throw {
                        value: game.playing,
                        msg: 'game is not playing',
                        param: 'playing',
                        location: 'database'
                    };

                if (!game.remainingBalls.length) {
                    console.log(game.remainingBalls);
                    await game.updateOne({ remainingBalls: createBalls() });
                }

                game = await Game.findOne(
                    req.body.game ? { _id: req.body.game } : {}
                )
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'user'
                        }
                    })
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'card'
                        }
                    });

                const index: number =
                    Math.floor(
                        Math.random() * (game.remainingBalls.length - 0)
                    ) + 0;

                await game.updateOne({
                    $push: {
                        balls: game.remainingBalls[index]
                    },
                    $pull: {
                        remainingBalls: game.remainingBalls[index]
                    }
                });

                game = await Game.findOne(
                    req.body.game ? { _id: req.body.game } : {}
                )
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'user'
                        }
                    })
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'card'
                        }
                    });

                const purchasedCards: IPurchasedCard[] = game.purchasedCards.filter(
                    (element) =>
                        element.card.data.find(
                            (e) => e == game.balls[index]
                        )
                );

                if (purchasedCards === undefined || purchasedCards == [])
                    return res.status(200).json(
                        JSON.stringify(
                            {
                                success: true,
                                data: game
                            },
                            null,
                            4
                        )
                    );

                const cards: IPurchasedCard[] = await PurchasedCard.find({
                    _id: purchasedCards.map((element) => element._id)
                })
                    .populate('card')
                    .populate('user');

                card: for (const card of cards) {
                    const ind = card.card.data.findIndex(
                        (element) => element == game.balls[index]
                    );
                    card.score[ind] = true;
                    await PurchasedCard.findOneAndUpdate(
                        { _id: card._id },
                        { score: card.score }
                    );
                    let count = 0;
                    for (const bool of card.score) {
                        if (count == 2) {
                            continue card;
                        }
                        if (!bool) count++;
                    }
                    await game.updateOne({ $push: { winningCards: card._id } });
                    await card.save();
                    await card.user.updateOne({ wonGames: game._id });
                }

                game = await Game.findOne(
                    req.body.game ? { _id: req.body.game } : {}
                )
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'user'
                        }
                    })
                    .populate({
                        path: 'purchasedCards',
                        populate: {
                            path: 'card'
                        }
                    });

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
        console.log(error);
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

const validateBall = (purchasedCards: IPurchasedCard[], game: IGame) => {
    const cards: IPurchasedCard[] = PurchasedCard.find({
        _id: purchasedCards.map((element) => element._id)
    });

    card: for (const card of cards) {
        const index = card.card.data.findIndex(
            (element) => element == game.remainingBalls[index]
        );
        card.score[index] = true;
        let count = 0;
        for (const bool of card.score) {
            if (count == 2) {
                card.save();
                continue card;
            }
            if (!bool) count++;
        }
        game.updateOne({ $push: { winningCards: card._id } });
        card.save();
    }
};
