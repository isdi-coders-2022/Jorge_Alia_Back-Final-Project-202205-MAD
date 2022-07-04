import mongoose from 'mongoose';
import { mongooseConnect, RelationField } from '../db/mongoose.js';

(async () => {
    await mongooseConnect();
})();

export interface iUser {
    _id?: string;
    name: string;
    email: string;
    passwd: string;
    workouts: Array<RelationField>;
    done: Array<RelationField>;
}

const userSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    email: mongoose.SchemaTypes.String,
    passwd: { type: mongoose.SchemaTypes.String, required: true },
    workouts: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Workout',
        },
    ],
    done: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Workout',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.passwd;
    },
});

export const User = mongoose.model('User', userSchema);
