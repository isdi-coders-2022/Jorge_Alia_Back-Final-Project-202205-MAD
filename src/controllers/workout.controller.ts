import { NextFunction, Request, Response } from 'express';
import { BasicController } from './basic.controller.js';
import { Model } from 'mongoose';
import { ExtRequest } from '../interfaces/token.js';

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
                    select: { email: 0, workouts: 0, done: 0 },
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
    addCommentController = async (req: Request, resp: Response) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const { text, score } = req.body;
        const findWorkout: any = await this.model.findOne({ id: idWorkout });
        findWorkout.comments.push({ text, user: id, score: score });
        findWorkout.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findWorkout));
    };

    deleteCommentController = async (req: Request, resp: Response) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const { text, score } = req.body;
        const findWorkout: any = await this.model.findOne({ id: idWorkout });
        findWorkout.comments = findWorkout.comments.filter(
            (item: any) => item.toString() !== idWorkout
        );
        findWorkout.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findWorkout));
    };
}
