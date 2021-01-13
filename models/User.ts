import { Schema, model, models, Document } from 'mongoose'
import { IGame } from 'models/Game'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  _id: Schema.Types.ObjectId | any;
  nickname: string;
  hash: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  admin: boolean;
  image: string;
  wonGames: IGame[] & Schema.Types.ObjectId[];
  purchasedGames: IGame[] & Schema.Types.ObjectId[];
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    minlength: 4
  },
  hash: {
    type: String,
    minlength: 4
  },
  firstname: {
    type: String,
    required: true,
    minlength: 4
  },
  lastname: {
    type: String,
    required: true,
    minlength: 4
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  admin: {
    type: Boolean,
    required: false,
    default: false
  },
  image: {
    type: String,
    required: false,
    default: 'none'
  },
  wonGames: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      default: []
    }
  ],
  purchasedGames: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      default: []
    }
  ]
})

userSchema.set('versionKey', false)
userSchema.set('timestamps', true)

userSchema.method(
  'encryptPassword',
  async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }
)

export default models.User || model<IUser>('User', userSchema)
