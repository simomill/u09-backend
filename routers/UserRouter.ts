import { Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ObjectId } from 'mongodb';
import { UsersDb } from '../database/UsersDb';
import { addTest } from '../UserData';
import { getUniqueFilename } from '../utils';

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

usersRouter.post('/', async (req, res) => {
    const image = req.files?.image as UploadedFile;

    if (!image) {
        res.send("No image");
    } else {
        const filename = getUniqueFilename(image.name);
        const uploadPath = `${__dirname}/public/uploads/${filename}`;

        await image.mv(uploadPath);
        
        addTest({
            username: req.body.username,
            img: `/uploads/${filename}`
        });

        res.sendStatus(201);
    }
})







export default usersRouter;