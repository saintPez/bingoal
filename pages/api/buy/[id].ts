import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import Game, { IGame } from 'models/Game';
import User, { IUser } from 'models/User';
import { ICard } from 'models/Card';
import PurchasedCard, { IPurchasedCard } from 'models/purchasedCard';
import { initMiddleware, validate } from 'utils/middleware';
import buyValidation from 'validation/buy.validation';
import tokenValidation from 'validation/token.validation';

const validateReq = initMiddleware(validate(buyValidation));
const validateAuth = initMiddleware(validate(tokenValidation));
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

                const game: IGame = await Game.findOne(
                    req.body.game ? { _id: req.body.game } : {}
                ).populate('cards');
                if (!game)
                    throw {
                        value: game,
                        msg: 'game not found',
                        param: '_id',
                        location: 'database'
                    };

                const card: ICard = game.cards.find(
                    (element) => element._id == req.query.id
                );
                if (!card)
                    throw {
                        value: card,
                        msg: 'card not found',
                        param: '_id',
                        location: 'database'
                    };

                await user.updateOne({
                    $push: {
                        purchasedGames: game._id
                    }
                });

                const purchasedCard: IPurchasedCard = new PurchasedCard({
                    user: req.body._id,
                    card: card._id
                });

                const newPurchasedCard = await purchasedCard.save();

                await game.updateOne({
                    $push: {
                        purchasedCards: newPurchasedCard._id
                    },
                    $pull: {
                        cards: card._id
                    }
                });

                res.status(201).json(
                    JSON.stringify(
                        {
                            success: true,
                            data: newPurchasedCard
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
