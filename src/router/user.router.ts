import { Router } from 'express';
import { User } from '../models/user.model.js';
import { UserController } from '../controllers/user.controller.js';
import { loginRequired } from '../middleware/login-required.js';

export const userController = new UserController(User);
export const userRouter = Router();

userRouter.get('/', userController.getAllController);
userRouter.get('/:id', loginRequired, userController.getController); // Poner loginRequired
userRouter.post('/register', userController.registerController);
userRouter.post('/login', userController.loginController);
userRouter.patch(
    '/addtofavorites/:id',
    loginRequired,
    userController.addWorkoutController
);
userRouter.patch(
    '/deletefromfavorites/:id',
    loginRequired,
    userController.deleteWorkoutController
);
userRouter.patch(
    '/addtodone/:id',
    loginRequired,
    userController.addDoneController
);
userRouter.patch(
    '/deletefromdone/:id',
    loginRequired,
    userController.deleteDoneController
);

userRouter.patch('/:id', loginRequired, userController.patchController);
userRouter.delete('/:id', loginRequired, userController.deleteController);
