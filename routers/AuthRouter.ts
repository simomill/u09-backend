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
authRouter.post('/register', async (req, res, next) => {
    const { username, password, name, email } = req.body;
    const isAdmin = 0;

    const existingUser = await UsersDb.getUserByUsername(username);

    if (existingUser) {
        res.status(400).send("User already exists");
    } else {
        const hashedPassword = hashPassword(password);
        const user: UserModel = { username, hashedPassword, name, email, isAdmin};
        const userId = await UsersDb.insertUser(user);
        
        res.send({ userId });
        next();
    }
});


// LOGIN W/ EXISTING USER
authRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await UsersDb.getUserByUsername(username);

    if (user) {
        const correctPass = comparePassword(password, user.hashedPassword);

        if (correctPass) {
            const jwt = getJWT(username, user._id);
            res.send({token: jwt, username: user.username, isAdmin: user.isAdmin});
        } else {
            res.send("Wrong Password");
            next();

        }
    } else {
        res.send("User don't exist");
        next();
    }
});



export default authRouter;