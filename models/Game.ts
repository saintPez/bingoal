import { Schema, model, models, Document } from 'mongoose';

export interface IGame extends Document {
    _id: Schema.Types.ObjectId | any;
    played: boolean;
    playing: boolean;
    purchasedCards: Schema.Types.ObjectId[] | any[];
    balls: number[];
    winningCards: Schema.Types.ObjectId[] | any[];
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
    purchasedCards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'purchasedCard',
            default: []
        }
    ],
    balls: [
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
