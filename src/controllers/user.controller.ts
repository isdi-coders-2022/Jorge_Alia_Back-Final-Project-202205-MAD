import { NextFunction, Request, Response } from 'express';
import { HydratedDocument, Model } from 'mongoose';
import { ExtRequest, iTokenPayload } from '../interfaces/token.js';
import { BasicController } from './basic.controller.js';
import * as aut from '../services/authorization.js';
import { iUser } from '../models/user.model.js';

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
    getControllerByToken = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        resp.setHeader('Content-type', 'application/json');
        let user;
        req as ExtRequest;
        try {
            user = await this.model
                .findById((req as ExtRequest).tokenPayload.id)
                .populate('workouts')
                .populate('done');
        } catch (error) {
            next(error);
            return;
        }

        if (user) {
            resp.send(JSON.stringify(user));
        } else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };

    loginController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const findUser: any = await this.model
            .findOne({
                email: req.body.email,
            })
            .populate('workouts');

        if (
            !findUser ||
            !(await aut.compare(req.body.passwd, findUser.passwd))
        ) {
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
        resp.send(JSON.stringify({ token, user: findUser }));
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
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newItem));
        } catch (error) {
            next(RangeError);
        }
    };
    addWorkoutController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        try {
            const idWorkout = req.params.id;
            const { id } = (req as ExtRequest).tokenPayload;

            let findUser: HydratedDocument<iUser> = (await this.model
                .findById(id)
                .populate('workouts')
                .populate('done')) as HydratedDocument<iUser>;
            if (findUser === null) {
                next('UserError');
                return;
            }
            if (
                findUser.workouts.some(
                    (item: any) => item._id.toString() === idWorkout
                )
            ) {
                const error = new Error('Workout already added to favorites');
                error.name = 'ValidationError';
                next(error);
                return;
            } else {
                findUser.workouts.push(idWorkout);
                findUser = await (await findUser.save()).populate('workouts');
                resp.setHeader('Content-type', 'application/json');
                resp.status(201);
                resp.send(JSON.stringify(findUser));
            }
        } catch (error) {
            next('RangeError');
        }
    };

    deleteWorkoutController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const findUser: HydratedDocument<iUser> = (await this.model
            .findById(id)
            .populate('workouts')
            .populate('done')) as HydratedDocument<iUser>;
        if (findUser === null) {
            next('UserError');
            return;
        }
        findUser.workouts = findUser.workouts.filter(
            (item: any) => item._id.toString() !== idWorkout
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
        try {
            const idWorkout = req.params.id;
            const { id } = (req as ExtRequest).tokenPayload;
            let findUser: HydratedDocument<iUser> = (await this.model
                .findById(id)
                .populate('done')
                .populate('workouts')) as HydratedDocument<iUser>;
            if (findUser === null) {
                next('UserError');
                return;
            }
            if (
                findUser.done.some(
                    (item: any) => item._id.toString() === idWorkout
                )
            ) {
                resp.send(JSON.stringify(findUser));
                const error = new Error('Workout already done');
                error.name = 'ValidationError';
                next(error);
            } else {
                findUser.done.push(idWorkout);
                findUser = await (await findUser.save()).populate('done');

                resp.setHeader('Content-type', 'application/json');
                resp.status(201);
                resp.send(JSON.stringify(findUser));
            }
        } catch (error) {
            next('RangeError');
        }
    };
    deleteDoneController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        const idWorkout = req.params.id;
        const { id } = (req as ExtRequest).tokenPayload;
        const findUser: HydratedDocument<iUser> = (await this.model
            .findById(id)
            .populate('done')
            .populate('workouts')) as HydratedDocument<iUser>;

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
