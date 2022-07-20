import { mongooseConnect } from '../db/mongoose';
import request from 'supertest';
import { server } from '../index.js';
import { app } from '../app.js';
import { User } from '../models/user.model';

let tokenUser = '';
let idUser = '';
let newWorkoutId = '';
describe('Given the routes of user', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    beforeEach(async () => {
        await mongooseConnect();
    });
    afterEach(async () => {
        server.close();
    });

    describe('When method POST is used in "/user/register/', () => {
        test('Then status should be 401', async () => {
            const newUser = {
                name: 'sergio',
                email: 'sergio@gmail.com',
                passwd: '12kdc88c5',
            };
            const response = await request(app)
                .post('/user/register')
                .send(newUser);
            idUser = response.body._id;
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method POST is used in "/user/login/', () => {
        test('Then status should be 201', async () => {
            const enterUser = {
                email: 'sergio@gmail.com',
                passwd: '12kdc88c5',
            };
            const response = await request(app)
                .post('/user/login')
                .send(enterUser);
            tokenUser = response.body.token;
            expect(response.statusCode).toBe(201);
        });
    });

    describe('When method GET is used', () => {
        test('I am logged, then status should be 200', async () => {
            const response = await request(app)
                .get('/user/')
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(200);
        });
        test('I am not logged, then status should be 401', async () => {
            const response = await request(app).get('/user/');
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method GET is used in "/:id" route', () => {
        test('If I am logged, then status should be 200', async () => {
            const response = await request(app)
                .get(`/user/${idUser}`)
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(200);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).get(`/user/${idUser}`);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method POST is used in "/:id" route', () => {
        test('If I am logged, then status should be 201', async () => {
            const newWorkoutUser = {
                title: 'BRAZOS & GLÚTEOS CON PESAS',
                image: 'brazosygluteos.png',
                video: 'https://www.youtube.com/embed/Ih0Pzws85Mc',
                description:
                    'Entrenamiento en cuadrupedia con intensidad alta enfocado en el trabajo de brazos y glúteo con el que consigues desarrollar más fuerza y control de tu cuerpo',
                category: 'Total body',
                complementaryMaterial: 'Sin material',
                duration: 11,
                intensity: 'Alta',
            };
            const response = await request(app)
                .post(`/workout`)
                .set('Authorization', 'Bearer ' + tokenUser)
                .send(newWorkoutUser);
            newWorkoutId = response.body._id;
            expect(response.statusCode).toBe(201);
        });
    });

    describe('When method PATCH is used in "/user/addtofavorites/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/addtofavorites/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/addtofavorites/${newWorkoutId}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is used in "/user/deletefromfavorites/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/deletefromfavorites/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(201);
        });
        test('If I am logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/deletefromfavorites/${newWorkoutId}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is used in "/user/addtodone/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/addtodone/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(201);
        });
        test('If I am logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/addtodone/${newWorkoutId}`
            );
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is used in "/user/deletefromdone/', () => {
        test('If I am logged, then status should be 201', async () => {
            const response = await request(app)
                .patch(`/user/deletefromdone/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(201);
        });
        test('If I am logged, then status should be 401', async () => {
            const response = await request(app).patch(
                `/user/deletefromdone/${newWorkoutId}`
            );
            expect(response.statusCode).toBe(401);
        });
    });

    describe('When method PATCH is used in "/user/:id', () => {});
    test('If I am logged, then status should be 200', async () => {
        const response = await request(app)
            .patch(`/user/${idUser}`)
            .set('Authorization', 'Bearer ' + tokenUser)
            .send({ name: 'pepe' });
        expect(response.statusCode).toBe(200);
    });
    test('If I am not logged, then status should be 401', async () => {
        const response = await request(app)
            .patch(`/user/${idUser}`)
            .send({ name: 'pepe' });
        expect(response.statusCode).toBe(401);
    });

    describe('When method DELETE is used in "/user/delete/:id', () => {});
    test('If I am logged, then status should be 202', async () => {
        const response = await request(app)
            .delete(`/user/delete/${idUser}`)
            .set('Authorization', 'Bearer ' + tokenUser);
        expect(response.statusCode).toBe(202);
    });
    test('If I am not logged, then status should be 401', async () => {
        const response = await request(app).delete(`/user/delete/${idUser}`);
        expect(response.statusCode).toBe(401);
    });
});

describe('Given the routes of workout', () => {
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
                .set('Authorization', 'Bearer ' + tokenUser);
            expect(response.statusCode).toBe(200);
        });
        test('If I am not logged, then status should be 200', async () => {
            const response = await request(app).get('/workout/');
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method PATCH is used in "/addcomment/:id" route', () => {
        test('If I am logged, then status should be 201', async () => {
            const newComent = {
                text: 'Buen entrenamiento',
                score: 8,
            };
            const response = await request(app)
                .patch(`/workout/addcomment/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser)
                .send(newComent);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const newComent = {
                text: 'Buen entrenamiento',
                score: 8,
            };
            const response = await request(app)
                .patch(`/workout/addcomment/${newWorkoutId}`)
                .send(newComent);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is used in "/deletecomment/:id" route', () => {
        test('If I am logged, then status should be 201', async () => {
            const deleteComment = { commentId: '62c47bf57596507010f450b0' };
            const response = await request(app)
                .patch(`/workout/addcomment/${newWorkoutId}`)
                .set('Authorization', 'Bearer ' + tokenUser)
                .send(deleteComment);
            expect(response.statusCode).toBe(201);
        });
        test('If I am not logged, then status should be 401', async () => {
            const deleteComment = { commentId: '62c47bf57596507010f450b0' };
            const response = await request(app)
                .patch(`/workout/addcomment/${newWorkoutId}`)
                .send(deleteComment);
            expect(response.statusCode).toBe(401);
        });
    });
});

describe('Given the routes of search', () => {
    describe('When method GET is used in "/search" route', () => {
        test(' then status should be 201', async () => {
            const search = 'brazo';
            const response = await request(app).get(`/search/?q=${search}`);
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method GET is used in "/search" route', () => {
        test(' then status should be 201', async () => {
            const search = 'pierna';
            const response = await request(app).get(`/search/?q=${search}`);
            expect(response.statusCode).toBe(201);
        });
    });
});
