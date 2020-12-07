import { Schema, model, models, Document } from 'mongoose';

export interface ICarton extends Document {
    data: number[];
    createdAt: Date;
    updatedAt: Date;
}

const cartonSchema = new Schema({
    data: [{
        required: true,
        type: Number,
        minlength: 25,
        maxlength: 25
    }],
});

cartonSchema.set('versionKey', false);
cartonSchema.set('timestamps', true);

export default models.Carton || model<ICarton>('Carton', cartonSchema);
