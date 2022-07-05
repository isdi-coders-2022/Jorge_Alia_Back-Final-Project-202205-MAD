import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserController } from './user.controller.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Given a instantiated controller UserController', () => {
    let req: Partial<Request>;
    let resp: Partial<Response>;
    let next: NextFunction = jest.fn();
    let mockPopulate = jest.fn();
    let mockModel = {
        find: jest.fn().mockReturnValue({
            populate: mockPopulate.mockReturnValue({
                populate: mockPopulate,
            }),
        }),
        findOne: jest.fn(),
        findById: jest.fn().mockReturnValue({ populate: mockPopulate }),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };
    let controller = new UserController(
        mockModel as unknown as mongoose.Model<{}>
    );
    bcryptjs.compare = jest.fn();
    jwt.sign = jest.fn();
    beforeEach(() => {
        req = {
            params: { id: '62b5d4943bc55ff0124f6c1d' },
        };
        resp = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    });
    describe('When method getAllController is called', () => {
        test('Then res.send should be called', async () => {
            await controller.getAllController(req as Request, resp as Response);
            expect(resp.send).toHaveBeenCalled();
        });
    });
    describe('When method loginController is called with a valid user', () => {
        test('Then resp.send should be called ', async () => {
            const mockResult = { id: 'test' };
            const mockedToken = 'test';
            (mockModel.findOne as jest.Mock).mockResolvedValue(mockResult);
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
        test('Then resp.send should be called ', async () => {
            const mockedToken = 'test';
            (mockModel.findOne as jest.Mock).mockResolvedValue(undefined);
            (bcryptjs.compare as jest.Mock).mockRejectedValue(undefined);
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
            (mockPopulate as jest.Mock).mockResolvedValue(mockResult);
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
            (mockPopulate as jest.Mock).mockRejectedValue(mockResult);
            await controller.getController(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method registerController is called', () => {
        test('Then if not error resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            req = { body: { pwd: 'test' } };
            (mockModel.create as jest.Mock).mockResolvedValue(mockResult);
            await controller.registerController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(resp.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then if error next  should be called ', async () => {
            req = { body: { pwd: 'test' } };
            (mockModel.create as jest.Mock).mockRejectedValue(undefined);
            await controller.registerController(
                req as Request,
                resp as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
