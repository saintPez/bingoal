import { Schema, model, models, Document } from 'mongoose';

export interface IGame extends Document {
    _id: Schema.Types.ObjectId | any;
    played: boolean;
    cartons: Schema.Types.ObjectId[] | any[];
    users: Schema.Types.ObjectId[] | any[];
    balls: number[];
    winningCartons: Schema.Types.ObjectId[] | any[];
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
    cartons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cartons',
            default: []
        }
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',
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
            ref: 'Cartons',
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
