import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    nickname: string;
    hash: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    admin: boolean;
    image: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        min: 4
    },
    hash: {
        type: String,
        min: 4
    },
    firstname: {
        type: String,
        required: true,
        min: 4
    },
    lastname: {
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
    },
    image: {
        type: String,
        required: false,
        default: 'profile'
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

export class Padder {

    len: number;
    pad: string;
    pads: string = '';

    constructor(len = 1, pad = '0') {
        this.len = len;
        this.pad = pad;

        while (this.pads.length < len) {
            this.pads += this.pad;
        }
    }

    Pad(what: number) {
        let s = what.toString();
        return this.pads.substring(0, this.pads.length - s.length) + s;
    }
}

export default models.User || model<IUser>('User', userSchema);
