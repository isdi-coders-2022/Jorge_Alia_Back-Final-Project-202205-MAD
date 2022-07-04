import { Router } from 'express';
import { WorkoutController } from '../controllers/workout.controller.js';
import { Workout } from '../models/workout.model.js';

export const workoutController = new WorkoutController(Workout);
export const workoutRouter = Router();

workoutRouter.get('/', workoutController.getAllController);
workoutRouter.get('/:id', workoutController.getController);
workoutRouter.post('/', workoutController.postController);
