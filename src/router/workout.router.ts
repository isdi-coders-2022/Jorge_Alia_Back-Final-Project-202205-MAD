import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import { Workout } from '../models/workout.model.js';
import { loginRequired } from '../middleware/login-required.js';

export const workoutController = new WorkoutController(Workout);
export const workoutRouter = Router();

workoutRouter.get('/', workoutController.getAllController);
workoutRouter.get('/:id', loginRequired, workoutController.getController);
workoutRouter.post('/', workoutController.postController);
workoutRouter.patch('/:id', workoutController.patchController);
