import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    admin: boolean;
    dateOfBirth: Date;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4
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
        min: 8
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    }
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
