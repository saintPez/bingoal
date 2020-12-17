import { Schema, model, models, Document } from 'mongoose';
import { IPurchasedCard } from 'models/purchasedCard';
import { ICard } from 'models/Card';

export interface IGame extends Document {
    _id: Schema.Types.ObjectId | any;
    played: boolean;
    playing: boolean;
    cards: Schema.Types.ObjectId[] & ICard[];
    purchasedCards: Schema.Types.ObjectId & IPurchasedCard[];
    balls: number[];
    remainingBalls: number[];
    winningCards: Schema.Types.ObjectId[] & ICard[];
    gameDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const gameSchema = new Schema({
    played: {
        type: Boolean,
        default: false
    },
    playing: {
        type: Boolean,
        default: false
    },
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Card',
            default: []
        }
    ],
    purchasedCards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'PurchasedCard',
            default: []
        }
    ],
    balls: [
        {
            type: Number,
            default: []
        }
    ],
    remainingBalls: [
        {
            type: Number,
            default: []
        }
    ],
    winningCards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Card',
            default: []
        }
    ],
    gameDate: {
        type: Date,
        required: true
    }
});

gameSchema.set('versionKey', false);
gameSchema.set('timestamps', true);

export default models.Game || model<IGame>('Game', gameSchema);
