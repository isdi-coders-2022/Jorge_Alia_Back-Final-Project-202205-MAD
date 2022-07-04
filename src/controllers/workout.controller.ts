import { NextFunction, Request, Response } from 'express';
import { BasicController } from './basic.controller';
import { Model } from 'mongoose';

export class WorkoutControoler<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }
    getAllController = async (req: Request, resp: Response) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(await this.model.find());
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
}
