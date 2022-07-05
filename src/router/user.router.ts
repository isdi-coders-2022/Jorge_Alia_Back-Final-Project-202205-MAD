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
userRouter.patch(
    '/addworkout/:id',
    loginRequired,
    userController.addWorkoutController
);
userRouter.patch(
    '/deleteworkout/:id',
    loginRequired,
    userController.deleteWorkoutController
);
userRouter.patch(
    '/adddone/:id',
    loginRequired,
    userController.addDoneController
);
userRouter.patch(
    '/deletedone/:id',
    loginRequired,
    userController.deleteDoneController
);

userRouter.patch('/:id', loginRequired, userController.patchController);
userRouter.delete('/:id', loginRequired, userController.deleteController);
