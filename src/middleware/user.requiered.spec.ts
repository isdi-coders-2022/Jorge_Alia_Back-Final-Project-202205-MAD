import { NextFunction, Response, Request } from 'express';
import { ExtRequest } from '../interfaces/token';
import { User } from '../models/user.model';
import { userRequired } from './user.required';

jest.mock('../models/user.model');
jest.mock('jsonwebtoken');
describe('Given the control error', () => {
    let req: Partial<ExtRequest>;
    let resp: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        (req = {
            params: { _id: '1' },
            tokenPayload: { _id: '1' },
        }),
            (next = jest.fn());
    });
    describe('When use user-required with valid token', () => {
        test('Then should be call next without error', async () => {
            await userRequired(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test('Then should be call next with error', async () => {
            User.findById = jest.fn().mockResolvedValueOnce({ _id: '2' });
            await userRequired(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
