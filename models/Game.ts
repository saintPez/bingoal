import { Schema, model, models, Document } from 'mongoose';

export interface IGame extends Document {
    _id: Schema.Types.ObjectId | any;
    played: boolean;
    cartons: Schema.Types.ObjectId[];
    winningCartons: Schema.Types.ObjectId[];
    gameDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const gameSchema = new Schema({
    played: {
        type: Boolean,
        default: false
    },
    cartons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Carton',
            default: []
        }
    ],
    balls: [
        {
            type: Number,
            default: []
        }
    ],
    winningCartons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Carton',
            default: []
        }
    ],
    gameDate: {
        type: Date,
        required: true,
        min: 4
    }
});

gameSchema.set('versionKey', false);
gameSchema.set('timestamps', true);

export default models.Game || model<IGame>('Game', gameSchema);
