import { NextFunction, Request, Response } from 'express';
import { BasicController } from './basic.controller.js';
import { HydratedDocument, Model } from 'mongoose';
import { ExtRequest } from '../interfaces/token.js';
import { iWorkout } from '../models/workout.model.js';

export class WorkoutController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }
    getAllController = async (req: Request, resp: Response) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(
            await this.model.find().populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: { email: 0, workouts: 0, done: 0, rol: 0 },
                },
            })
        );
    };
    getController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        resp.setHeader('Content-type', 'application/json');
        let result;
        try {
            result = await this.model.findById(req.params.id);
        } catch (error) {
            next(error);
            return;
        }
        if (result) {
            resp.send(JSON.stringify(result));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    addCommentController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;

        const { text, score } = req.body;

        const findWorkout: HydratedDocument<iWorkout> = (await this.model
            .findById(idWorkout)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: {
                        email: 0,
                        workouts: 0,
                        done: 0,
                        rol: 0,
                    },
                },
            })) as HydratedDocument<iWorkout>;

        if (findWorkout === null) {
            next('UserError');
            return;
        }
        findWorkout.comments.push({ text, user: id, score: score });
        findWorkout.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findWorkout));
    };

    deleteCommentController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const idComment = req.body.commentId;
        const { id } = (req as ExtRequest).tokenPayload;
        const findWorkout: HydratedDocument<iWorkout> = (await this.model
            .findById(idWorkout)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: {
                        email: 0,
                        workouts: 0,
                        done: 0,
                        rol: 0,
                    },
                },
            })) as HydratedDocument<iWorkout>;

        if (findWorkout === null) {
            next('UserError');
            return;
        } else {
            findWorkout.comments = findWorkout.comments.filter((item: any) => {
                return item._id?.toString() !== idComment && id !== item.user;
            });
            findWorkout.save();
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(findWorkout));
        }
    };
}
