import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { workoutRouter } from './router/workout.router.js';
import { userRouter } from './router/user.router.js';
import { errorControl } from './middleware/error.control.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/workout', workoutRouter);
app.use('/workouts', workoutRouter);
app.use('/user', userRouter);
app.use('/users', userRouter);

app.use(errorControl);
