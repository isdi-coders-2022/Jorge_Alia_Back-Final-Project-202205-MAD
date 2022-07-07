import { iUser, User } from '../models/user.model';
import { iWorkout } from '../models/workout.model';
import { encrypt } from '../services/authorization';
import { mongooseConnect } from './mongoose';

let aUsers: Array<iUser> = [
    {
        name: 'Ango',
        email: 'ango@gmail.com',
        passwd: '1234',
        workouts: [],
        done: [],
        rol: 'User',
    },
    {
        name: 'Sergio',
        email: 'sergio@gmail.com',
        passwd: '1234',
        workouts: [],
        done: [],
        rol: 'User',
    },
];

const aWorkouts: Array<iWorkout> = [
    {
        title: 'ABDOMEN & GLÚTEOS con softball',
        image: 'totalbodysoftball.png',
        video: 'https://www.youtube.com/embed/wdqQmD874Fo',
        description: 'Entrenamiento.',
        category: 'Total body',
        complementaryMaterial: 'Sin material',
        favorite: false,
        duration: 10,
        intensity: 'Alta',
        comments: [
            {
                text: 'muy bueno',
                user: '',
                score: 9,
            },
        ],
    },
    {
        title: 'TOTAL BODY con banda',
        image: 'totalbodybanda.png',
        video: 'https://www.youtube.com/embed/jVioyqKb4kY',
        description: 'Hola',
        category: 'Total body',
        complementaryMaterial: 'Banda',
        favorite: false,
        duration: 16,
        intensity: 'Baja',
        comments: [
            {
                text: 'muy bueno',
                user: '',
                score: 9,
            },
        ],
    },
];

export const initDB = async () => {
    const connect = await mongooseConnect();
    (aUsers as any) = await Promise.all(
        aUsers.map(async (item) => ({
            ...item,
            passwd: await encrypt(item.passwd),
        }))
    );

    const users = await User.insertMany(aUsers);
    aWorkouts[0].comments[0].user = users[0].id;
    aWorkouts[1].comments[1].user = users[1].id;

    const workout = await User.insertMany(aWorkouts);
    (aUsers[0].workouts[0] as any) = aWorkouts[0]._id;
    (aUsers[1].workouts[1] as any) = aWorkouts[1]._id;

    (aUsers[0].done[0] as any) = aWorkouts[0]._id;
    (aUsers[1].done[1] as any) = aWorkouts[1]._id;

    connect.disconnect();
    return {
        workout,
        users,
    };
};
