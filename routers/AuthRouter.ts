import { Router } from 'express';
import { UsersDb } from '../database/UsersDb';
import { forceAuth } from '../middelwares';
import UserModel from '../models/UserModel';
import {comparePassword, getJWT, hashPassword} from '../utils'

const authRouter = Router();

// FORCE LOGIN & SHOW USERNAME
authRouter.get('/test', forceAuth, (req, res) => {
    res.send(`Hello user: ${res.locals.user.username}`);
})

// Register new user
authRouter.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;

    const existingUser = await UsersDb.getUserByUsername(username);

    if (existingUser) {
        res.status(400).send("User already exists");
    } else {
        const hashedPassword = hashPassword(password);
        const user: UserModel = { username, hashedPassword, name, email};
        const userId = await UsersDb.insertUser(user);
        
        res.send({ userId });
    }
});


// LOGIN W/ EXISTING USER
authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await UsersDb.getUserByUsername(username);

    if (user) {
        const correctPass = comparePassword(password, user.hashedPassword);

        if (correctPass) {
            const jwt = getJWT(username, user._id);
            res.send({token: jwt, username: user.username});
        } else {
            res.send("Wrong Password");
        }
    } else {
        res.send("User don't exist");
    }
});

// LOGOUT W/ EXISTING USER
authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await UsersDb.getUserByUsername(username);

    if (user) {
        const correctPass = comparePassword(password, user.hashedPassword);

        if (correctPass) {
            const jwt = getJWT(username, user._id);
            res.send(jwt);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});



export default authRouter;