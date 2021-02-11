import { Schema, model, models, Document } from 'mongoose'

export interface ICard extends Document {
  _id: string
  data: number[]
}

const cardSchema = new Schema({
  data: [
    {
      type: Number,
      required: true,
    },
  ],
})

cardSchema.set('versionKey', false)
cardSchema.set('timestamps', true)

export default models.Card || model<ICard>('Card', cardSchema)
