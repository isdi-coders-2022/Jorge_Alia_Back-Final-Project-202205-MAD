import { NextFunction, Request, Response } from 'express';
import { WorkoutController } from './workout.controller';
import mongoose from 'mongoose';

describe('Given a instantiated controller WorkoutController', () => {
    let req: Partial<Request>;
    let resp: Partial<Response>;
    let next: NextFunction;

    let mockModel = {
        find: jest.fn().mockReturnValue({ populate: jest.fn() }),
        findById: jest.fn().mockReturnValue({ populate: jest.fn() }),
        create: jest.fn(),
    };
    let controller = new WorkoutController(
        mockModel as unknown as mongoose.Model<{}>
    );
    beforeEach(() => {
        req = {
            params: { id: '62b9e534a202c8a096e0d7ba' },
            body: { user: '62bb10cb54f3a58a2faa20c5' },
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
        test('And response is not ok, then resp.send should be called without data', async () => {
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
});
