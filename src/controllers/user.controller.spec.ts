import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserController } from './user.controller.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ExtRequest } from '../interfaces/token.js';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Given a instantiated controller UserController', () => {
    let req: Partial<ExtRequest>;
    let resp: Partial<Response>;
    let next: NextFunction;
    let mockPopulate = jest.fn();

    let mockModel = {
        find: jest.fn().mockReturnValue({
            populate: mockPopulate.mockReturnValue({
                populate: mockPopulate,
            }),
        }),
        findById: jest.fn().mockReturnValue({ populate: mockPopulate }),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOne: jest.fn().mockReturnValue({
            populate: jest.fn(),
            id: '62b9e534a202c8a096e0d7ba',
            workouts: [
                {
                    _id: '62c3fa970a6339f727766546',
                },
            ],
            done: [{}],
            save: jest.fn(),
        }),
    };

    let controller = new UserController(
        mockModel as unknown as mongoose.Model<{}>
    );
    beforeEach(() => {
        req = {
            params: { id: '62b5d4943bc55ff0124f6c1d' },
            body: {
                _id: '62c3fa970a6339f727766546',
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
    describe('When method loginController is called with a valid user', () => {
        test('Then resp.send should be called ', async () => {
            const mockResult = {
                populate: jest.fn().mockResolvedValue({ id: 'test' }),
            };
            const mockedToken = 'test';
            (mockModel.findOne as jest.Mock).mockReturnValueOnce(mockResult);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('Then next should be called ', async () => {
            const mockedToken = 'test';
            (bcryptjs.compare as jest.Mock).mockRejectedValueOnce(undefined);
            (jwt.sign as jest.Mock).mockResolvedValue(mockedToken);
            req = { body: { name: 'test' } };
            await controller.loginController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method getController is called', () => {
        test('Then with a ok response resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            (mockPopulate as jest.Mock).mockResolvedValue(mockResult);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('And response is not ok, then resp.send should be called without data', async () => {
            const mockResult = null;
            (mockPopulate as jest.Mock).mockResolvedValueOnce(mockResult);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            (mockPopulate as jest.Mock).mockRejectedValueOnce(mockResult);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method getControllerByToken is called', () => {
        test('Then should be call rest.status with 404', async () => {
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(undefined),
                }),
            });

            await controller.getControllerByToken(
                req as Request,
                resp as Response,
                next as NextFunction
            );

            expect(resp.status).toHaveBeenCalledWith(404);
        });
        test('Then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.getControllerByToken(
                req as Request,
                resp as Response,
                next as NextFunction
            );

            expect(resp.send).toHaveBeenCalled();
        });
        test('Then resp.next should be called', async () => {
            await controller.getControllerByToken(
                req as Request,
                resp as Response,
                next as NextFunction
            );

            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method registerController is called', () => {
        test('Then if not error resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            req = { body: { pwd: 'test-2022' } };
            (mockModel.create as jest.Mock).mockResolvedValueOnce(mockResult);
            await controller.registerController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then if error next  should be called ', async () => {
            req = { body: { pwd: 'test-2022' } };
            (mockModel.create as jest.Mock).mockRejectedValueOnce(undefined);
            await controller.registerController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addWorkoutController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };

            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };

            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.addWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called with RangeError', async () => {
            mockModel.findById.mockResolvedValueOnce(null);
            await controller.addWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalledWith('RangeError');
        });
        test('Next it should be called, when User is not found ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };

            const mockResult = null;
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.addWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when the workout already added to favorites ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };

            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1d',
                workouts: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn(),
            };

            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.addWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteWorkoutController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };

            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                workouts: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.deleteWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteWorkoutController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method addDoneController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };

            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called with RangeError', async () => {
            req = {};
            await controller.addDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when User is not found ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = null;
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.addDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
        test('Next it should be called, when the workout already added to favorites ', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };
            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn(),
            };
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.addDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method deleteDoneController is called', () => {
        test('And response is ok, then resp.send should be called', async () => {
            req = {
                params: { id: '62b5d4943bc55ff0124f6c1d' },
                tokenPayload: {
                    id: '62b9e534a202c8a096e0d7ba',
                },
            };

            const mockResult = {
                id: '62b5d4943bc55ff0124f6c1e',
                done: [{ _id: '62b5d4943bc55ff0124f6c1d' }],
                save: jest.fn().mockReturnValue({
                    populate: jest.fn(),
                }),
            };
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });

            await controller.deleteDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalled();
        });
        test('And response is not ok, then next should be called', async () => {
            const mockResult = null;
            (mockModel.findById as jest.Mock).mockReturnValueOnce({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockResult),
                }),
            });
            await controller.deleteDoneController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
