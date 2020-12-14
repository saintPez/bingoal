import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import dbConnect from 'utils/dbConnect';
import Game, { IGame } from 'models/Game';
import User, { IUser } from 'models/User';
import Card, { ICard } from 'models/Card';
import PurchasedCard, { IPurchasedCard } from 'models/purchasedCard';
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

                const card: ICard = await Card.findOne({
                    _id: req.query.id,
                    purchased: false
                });
                if (!card)
                    throw {
                        value: card,
                        msg: 'card not found',
                        param: 'card',
                        location: 'database'
                    };
                const game: IGame = await Game.findOne();
                if (!game)
                    throw {
                        value: game,
                        msg: 'game not found',
                        param: 'game',
                        location: 'database'
                    };

                await card.updateOne({
                    purchased: true
                });
                const purchasedCard: IPurchasedCard = new PurchasedCard({
                    user: req.body._id,
                    card: card._id
                });

                const newPurchasedCard = await purchasedCard.save();

                await game.updateOne({
                    $push: {
                        purchasedCards: newPurchasedCard._id
                    }
                });

                res.status(200).json(
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
