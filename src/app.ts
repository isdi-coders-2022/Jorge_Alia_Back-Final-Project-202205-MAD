import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { workoutRouter } from './router/workout.router.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/workout', workoutRouter);
