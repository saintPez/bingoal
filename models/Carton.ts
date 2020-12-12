import { Schema, model, models, Document } from 'mongoose';

export interface ICarton extends Document {
    _id: Schema.Types.ObjectId | any;
    data: number[] | Array<null>;
    createdAt: Date;
    updatedAt: Date;
}

const cartonSchema = new Schema({
    data: [
        {
            required: true,
            type: Number
        }
    ]
});

cartonSchema.set('versionKey', false);
cartonSchema.set('timestamps', true);

export default models.Carton || model<ICarton>('Carton', cartonSchema);
