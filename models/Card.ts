import { Schema, model, models, Document } from 'mongoose'
export interface ICard extends Document {
  _id: Schema.Types.ObjectId | any;
  data: number[] | Array<null>;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema({
  data: [
    {
      required: true,
      type: Number
    }
  ]
})

cardSchema.set('versionKey', false)
cardSchema.set('timestamps', true)

export default models.Card || model<ICard>('Card', cardSchema)
