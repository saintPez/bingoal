import { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
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

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  avatar_url: {
    type: String,
    default: '',
  },
  email: {
    private: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
      unique: true,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  birth_date: {
    private: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Date,
      required: true,
    },
  },
  time_zone: {
    private: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
      required: true,
    },
  },
  language: {
    type: String,
    default: 'en',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  baned: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
})

userSchema.set('versionKey', false)
userSchema.set('timestamps', true)

export default models.User || model<IUser>('User', userSchema)
