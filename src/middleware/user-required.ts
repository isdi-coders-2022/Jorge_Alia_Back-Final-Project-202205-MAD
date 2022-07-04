import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/token';
import { Workout } from '../models/workout.model.js';

export const userRequiredForWorkout = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const userID = (req as unknown as ExtRequest).tokenPayload.id;
    const findWorkout = await Workout.findById(req.params.id);
    if (findWorkout === userID) {
        next();
    } else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
