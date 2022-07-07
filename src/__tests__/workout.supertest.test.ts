import request from 'supertest';
import { server } from '../index.js';
import { initDB } from '../db/init.db';
import { mongooseConnect } from '../db/mongoose';
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
            const response = await request(app).get('/workout/');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/:id" route', () => {
        test('If I am logged, then status should be 200', async () => {
            const response = await request(app)
                .get('/workout/')
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method GET is used in "/:id" route', () => {
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).get(
                `/workout/${data.workout[0].id}`
            );
            expect(response.statusCode).toBe(401);
        });
    });

    describe('When method PATCH is used in "/addcomment/:id" route', () => {
        test('If I am logged, then status should be 201', async () => {
            const newComent = {
                text: 'Buen entrenamiento JOSEEEEE',
                score: 8,
            };
            const response = await request(app)
                .patch(`/workout/addcomment/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(newComent);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const newComent = {
                text: 'Buen entrenamiento JOSEEEEE',
                score: 8,
            };
            const response = await request(app)
                .patch(`/workout/addcomment/${data.workout[0].id}`)
                .send(newComent);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is used in "/deletecomment/:id" route', () => {
        test('If I am logged, then status should be 201', async () => {
            const deleteComment = { commentId: '62c47bf57596507010f450b0' };
            const response = await request(app)
                .patch(`/workout/addcomment/${data.workout[0].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(deleteComment);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const deleteComment = { commentId: '62c47bf57596507010f450b0' };
            const response = await request(app)
                .patch(`/workout/addcomment/${data.workout[0].id}`)
                .send(deleteComment);
            expect(response.statusCode).toBe(401);
        });
    });
});
