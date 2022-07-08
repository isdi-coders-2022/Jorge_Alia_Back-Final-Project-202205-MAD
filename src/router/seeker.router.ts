import { Router } from 'express';
import { SeekerController } from '../controllers/seeker.controller.js';

export const seekerController = new SeekerController();
export const seekerRouter = Router();

seekerRouter.get('/', seekerController.getSeekerTitle);
