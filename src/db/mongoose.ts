/* istanbul ignore file */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function mongooseConnect() {
    const url =
        process.env.NODE_ENV?.toLocaleLowerCase() === 'test'
            ? process.env.URL_MONGO_TEST
            : process.env.URL_MONGO;
    return mongoose.connect(url as string);
}

export interface RelationField {
    type: mongoose.Types.ObjectId;
    ref: string;
}
