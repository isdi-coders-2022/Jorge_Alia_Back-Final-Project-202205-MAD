/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
export class BasicController<T> {
    constructor(public model: Model<T>) {}

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
        const result = await this.model.findById(req.params.id);
        if (result) {
            resp.send(JSON.stringify(result));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };

    postController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const newItem = await this.model.create(req.body);
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };

    patchController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const newItem = await this.model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            resp.setHeader('Content-type', 'application/json');
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };

    deleteController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const deleteItem = await this.model.findByIdAndDelete(
                req.params.id
            );
            if (deleteItem === null) {
                resp.status(404);
                resp.send(
                    JSON.stringify({
                        error: 'Delete impossible',
                    })
                );
            } else {
                resp.status(202);
                resp.send(JSON.stringify(deleteItem));
            }
        } catch (error) {
            next(error);
        }
    };
}
