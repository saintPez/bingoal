import { Schema, model, models, Document } from 'mongoose';

export interface IPurchasedCard extends Document {
    _id: Schema.Types.ObjectId | any;
    user: Schema.Types.ObjectId | any;
    card: Schema.Types.ObjectId | any;
    createdAt: Date;
    updatedAt: Date;
}

const purchasedCardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
    }
});

purchasedCardSchema.set('versionKey', false);
purchasedCardSchema.set('timestamps', true);

export default models.purchasedCard || model<IPurchasedCard>('purchasedCard', purchasedCardSchema);