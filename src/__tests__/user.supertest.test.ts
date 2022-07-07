import { mongooseConnect } from '../db/mongoose';
import request from 'supertest';
import { server } from '../index.js';
import { initDB } from '../db/init.db';
import * as aut from '../services/authorization';
import { app } from '../app.js';

describe('Given the routes of workout', () => {
    let data: { [key: string]: Array<any> };
    let token: string;
    beforeAll(async () => {
        data = await initDB();
    });

    beforeEach(async () => {
        await mongooseConnect();
        token = aut.createToken({
            id: data.users[0].id,
            name: data.users[0].name,
        });
    });
    afterEach(async () => {
        server.close();
    });
    describe('When method GET is used', () => {
        test('then status should be 200', async () => {
            const response = await request(app).get('/user/');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/:id" route', () => {
        test('If I am logged, then status should be 200', async () => {
            const response = await request(app)
                .get('/user/')
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/:id" route', () => {
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).get(
                `/user/${data.users[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/user/register/', () => {
        test('Then status should be 401', async () => {
            const newUser = {
                name: 'sergio',
                email: 'sergio@gmail.com',
                passwd: '12345',
            };
            const response = await request(app)
                .post('/user/register')
                .send(newUser);
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method POST is used in "/user/login/', () => {
        test('Then status should be 201', async () => {
            const enterUser = {
                email: 'sergio@gmail.com',
                passwd: '12345',
            };
            const response = await request(app)
                .post('/user/login')
                .send(enterUser);
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method POST is used in "/user/addtofavorites/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/addtofavorites/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/addtofavorites/${data.workout[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/user/deletefromfavorites/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/deletefromfavorites/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/deletefromfavorites/${data.workout[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/user/addtodone/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/addtodone/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/addtodone/${data.workout[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/user/deletefromdone/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/deletefromdone/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/deletefromdone/${data.workout[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
});
