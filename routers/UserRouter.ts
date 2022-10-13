import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { UsersDb } from '../database/UsersDb';

const usersRouter = Router();

// get all users
usersRouter.get('/', async (req, res) => {

    const result = await UsersDb.getUsers();

    res.send(result);
});

// get one user
usersRouter.get('/:name', async (req, res) => {
    const username = req.params.name;

    const result = await UsersDb.getUserByUsername(username);

    res.send(result);
})









export default usersRouter;