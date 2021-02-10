import { Schema, model, models, Document } from 'mongoose'

export interface IGame extends Document {
  _id: string
  name: string
  avatar_url: string
  email: {
    private?: boolean
    data: string
  }
  password: string
  birth_date: {
    private?: boolean
    data: Date
  }
  time_zone: {
    private?: boolean
    data: string
  }
  language: string
  verified: boolean
  baned: boolean
  admin: boolean
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
      data: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
      },
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
