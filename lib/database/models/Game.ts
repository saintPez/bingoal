import { Schema, model, models, Document } from 'mongoose'

import { IUser } from 'lib/database/models/user'
import { ICard } from 'lib/database/models/card'

export interface IGame extends Document {
  _id: string
  played: boolean
  playing: boolean
  cards: [
    {
      purchased: boolean
      won: boolean
      user?: string | IUser
      data: string | ICard
    }
  ]
  balls: [
    {
      saved: boolean
      data: number
    }
  ]
  game_date: Date
  createdAt: Date
  updatedAt: Date
}

const gameSchema = new Schema({
  played: {
    type: Boolean,
    default: false,
  },
  playing: {
    type: Boolean,
    default: false,
  },
  cards: [
    {
      purchased: {
        type: Boolean,
        default: false,
      },
      won: {
        type: Boolean,
        default: false,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      data: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
        unique: true,
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
            true,
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
          ],
        },
      ],
    },
  ],
  balls: [
    {
      saved: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Number,
      },
    },
  ],
  game_date: {
    type: Date,
    required: true,
  },
})

gameSchema.set('versionKey', false)
gameSchema.set('timestamps', true)

export default models.Game || model<IGame>('Game', gameSchema)
