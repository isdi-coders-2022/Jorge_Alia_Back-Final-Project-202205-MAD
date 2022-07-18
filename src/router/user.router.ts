import { Router } from 'express';
import { User } from '../models/user.model.js';
import { UserController } from '../controllers/user.controller.js';
import { loginRequired } from '../middleware/login.required.js';
import { userRequired } from '../middleware/user.required.js';

export const userController = new UserController(User);
export const userRouter = Router();

userRouter.get('/', loginRequired, userController.getAllController);
userRouter.get('/:id', loginRequired, userController.getController);
userRouter.post(
    '/loginWithToken',
    loginRequired,
    userController.getControllerByToken
);
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

userRouter.patch(
    '/:id',
    loginRequired,
    userRequired,
    userController.patchController
);
userRouter.delete(
    '/delete/:id',
    loginRequired,
    userRequired,
    userController.deleteController
);
