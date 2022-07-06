import { NextFunction, Request, Response } from 'express';
import { WorkoutController } from './workout.controller';
import mongoose from 'mongoose';
import { ExtRequest } from '../interfaces/token';
import { iWorkout } from '../models/workout.model';

describe('Given a instantiated controller WorkoutController', () => {
    let req: Partial<ExtRequest>;
    let resp: Partial<Response>;
    let next: NextFunction;

    let mockModel = {
        find: jest.fn().mockReturnValue({ populate: jest.fn() }),
        findById: jest.fn().mockReturnValue({ populate: jest.fn() }),
        create: jest.fn(),
        findOne: jest.fn().mockResolvedValue({
            comments: [
                {
                    text: 'Comment test',
                    user: '62c31e157e6d3bb95caded9a',
                    _id: '62c5659c245f7c999e3b5a3c',
                },
            ],
            save: jest.fn(),
        } as unknown as mongoose.HydratedDocument<iWorkout>),
    };
    let controller = new WorkoutController(
        mockModel as unknown as mongoose.Model<{}>
    );
    beforeEach(() => {
        req = {
            params: { id: '62b9e534a202c8a096e0d7ba' },
            body: {
                user: '62bb10cb54f3a58a2faa20c5',
                text: 'Comentario de prueba',
                score: 9,
                idComment: '62c47bf57596507010f450ad',
            },
            tokenPayload: {
                id: '62b9e534a202c8a096e0d7ba',
            },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });
    describe('When method getAllController is called', () => {
        test('Then res.send should be called', async () => {
            await controller.getAllController(req as Request, resp as Response);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method getController is called', () => {
        test('Then res.send should be called', async () => {
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then resp.send should be called without data', async () => {
            const result = null;
            mockModel.findById = jest.fn().mockResolvedValue(result);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('And response is not ok, then next should be called', async () => {
            const result = null;
            mockModel.findById = jest.fn().mockRejectedValue(result);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addCommentController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            await controller.addCommentController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            mockModel.findOne = jest.fn().mockRejectedValueOnce(null);
            await controller.addCommentController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            mockModel.findOne.mockResolvedValueOnce(null);
            await controller.addCommentController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method deleteCommentController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            mockModel.findOne.mockResolvedValueOnce({
                comments: [
                    {
                        text: 'Comment tes',
                        user: '62c31e157e6d3bb95caded9a',
                        _id: '62c5659c245f7c999e3b5a3c',
                    },
                ],
                save: jest.fn(),
            });
            await controller.deleteCommentController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            mockModel.findOne.mockResolvedValueOnce(null);
            await controller.deleteCommentController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
