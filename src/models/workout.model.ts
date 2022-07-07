/* istanbul ignore file */
import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose.js';

(async () => {
    await mongooseConnect();
})();

export interface iWorkout {
    _id?: string;
    title: string;
    image: string;
    video: string;
    description: string;
    category: string;
    complementaryMaterial: string;
    favorite: boolean;
    duration: number;
    intensity: string;
    comments: Array<{
        text: string;
        user: string;
        score: number;
        _id?: string;
    }>;
}

const workoutSchema = new mongoose.Schema({
    title: { type: mongoose.SchemaTypes.String, required: true },
    image: { type: mongoose.SchemaTypes.String, required: true },
    video: { type: mongoose.SchemaTypes.String, required: true },
    description: mongoose.SchemaTypes.String,
    category: mongoose.SchemaTypes.String,
    complementaryMaterial: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    favorite: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    duration: { type: mongoose.SchemaTypes.Number, required: true },
    intensity: { type: mongoose.SchemaTypes.String, required: true },
    comments: [
        {
            text: { type: mongoose.SchemaTypes.String },
            user: { type: mongoose.Types.ObjectId, ref: 'User' },
            score: { type: mongoose.SchemaTypes.Number, min: 1, max: 10 },
        },
    ],
});

workoutSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Workout = mongoose.model('Workout', workoutSchema);
