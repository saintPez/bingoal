import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    nickname: string;
    hash: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    admin: boolean;
    image: string;
    wonGames: Schema.Types.ObjectId;
    purchasedGames: Schema.Types.ObjectId;
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
        default: 'profile'
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
});

userSchema.set('versionKey', false);
userSchema.set('timestamps', true);

userSchema.method(
    'encryptPassword',
    async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
);

userSchema.method(
    'validatePassword',
    async function (password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
);

export default models.User || model<IUser>('User', userSchema);
