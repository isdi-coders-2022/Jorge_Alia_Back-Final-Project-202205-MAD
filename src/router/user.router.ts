import { Router } from 'express';
import { User } from '../models/user.model.js';
import { UserController } from '../controllers/user.controller.js';
import { loginRequired } from '../middleware/login-required.js';

export const userController = new UserController(User);
export const userRouter = Router();

userRouter.get('/', userController.getAllController);
userRouter.get('/:id', userController.getController); // Poner loginRequired
userRouter.post('/register', userController.registerController);
userRouter.post('/login', userController.loginController);
userRouter.patch('/:id', userController.patchController); //Poner loginRequired
userRouter.delete('/:id', loginRequired, userController.deleteController);
