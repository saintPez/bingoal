import { Schema, model, models, Document } from 'mongoose';
import { IUser } from 'models/User';
import { ICard } from 'models/Card';

export interface IPurchasedCard extends Document {
    _id: Schema.Types.ObjectId | any;
    user: Schema.Types.ObjectId & IUser;
    card: Schema.Types.ObjectId & ICard;
    score: boolean[];
    createdAt: Date;
    updatedAt: Date;
}

const purchasedCardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    score: [
        {
            type: Boolean,
            default: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        }
    ]
});

purchasedCardSchema.set('versionKey', false);
purchasedCardSchema.set('timestamps', true);

export default models.PurchasedCard ||
    model<IPurchasedCard>('PurchasedCard', purchasedCardSchema);
