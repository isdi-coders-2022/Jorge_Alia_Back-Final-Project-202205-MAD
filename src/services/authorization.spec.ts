import jwt from 'jsonwebtoken';
import { iTokenPayload } from '../interfaces/token';
import { createToken, verifyToken, compare, encrypt } from './authorization';
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given the module authorization', () => {
    let tokenPayLoad: iTokenPayload;
    beforeEach(() => {
        tokenPayLoad = {
            id: '',
            name: '',
        };
    });
    describe('When encrypt is called', () => {
        test('Then it should call bcrypt.hash', async () => {
            bcrypt.hash = jest.fn().mockReturnValue({});
            await encrypt('1234', 10);

            expect(bcrypt.hash).toHaveBeenCalled();
        });
        test('Then it should call bcrypt.hash', async () => {
            bcrypt.hash = jest.fn().mockReturnValue({});
            const result = await encrypt('');

            expect(result).toBeUndefined();
        });
    });
    describe('When compare is called', () => {
        test('Then it should call bcrypt.compare', async () => {
            bcrypt.compare = jest.fn().mockReturnValue(true);
            await compare('test', 'testing test');
            expect(bcrypt.compare).toHaveBeenCalled();
        });
        describe('When createToken is called', () => {
            test('Then it should call jwt.sign', () => {
                jwt.sign = jest.fn().mockReturnValue('token');
                const token = createToken(tokenPayLoad);

                expect(jwt.sign).toHaveBeenCalled();
                expect(token).toBe('token');
            });
        });

        describe('When veirfyToken is called', () => {
            test('Then it should call jwt.verify', () => {
                jwt.verify = jest.fn().mockReturnValue('token');
                const token = verifyToken('token');

                expect(jwt.verify).toHaveBeenCalled();
                expect(token).toBe('token');
            });
        });
    });
});
