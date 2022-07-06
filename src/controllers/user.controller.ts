import { NextFunction, Request, Response } from 'express';
import { HydratedDocument, Model } from 'mongoose';
import { ExtRequest, iTokenPayload } from '../interfaces/token.js';
import { BasicController } from './basic.controller.js';
import * as aut from '../services/authorization.js';

export class UserController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllController = async (req: Request, resp: Response) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(
            await this.model.find().populate('workouts').populate('done')
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
            result = await this.model
                .findById(req.params.id)
                .populate('workouts');
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

    registerController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        let newItem: HydratedDocument<any>;
        try {
            req.body.passwd = await aut.encrypt(req.body.passwd);
            newItem = await this.model.create(req.body);
        } catch (error) {
            next(error);
            return;
        }
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(newItem));
    };
    loginController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const findUser: any = await this.model.findOne({
            email: req.body.email,
        });
        if (!findUser || !aut.compare(req.body.passwd, findUser.passwd)) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad: iTokenPayload = {
            id: findUser.id,
            name: findUser.name,
        };
        const token = aut.createToken(tokenPayLoad);
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify({ token, id: findUser.id }));
    };
    addWorkoutController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;

        const findUser: any = await this.model.findOne({ id });
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.workouts.push(idWorkout);
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
    deleteWorkoutController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const findUser: any = await this.model.findOne({ id });
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.workouts = findUser.workouts.filter(
            (item: any) => item.toString() !== idWorkout
        );
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
    addDoneController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const findUser: any = await this.model.findOne({ id });
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.done.push(idWorkout);
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
    deleteDoneController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const findUser: any = await this.model.findOne({ id });
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.done = findUser.done.filter(
            (item: any) => item.toString() !== idWorkout
        );
        findUser.save();
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(findUser));
    };
}
