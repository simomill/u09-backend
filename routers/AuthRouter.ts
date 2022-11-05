import { Router } from "express";
import { UsersDb } from "../database/UsersDb";
import { forceAuth } from "../middelwares";
import UserModel, { UserInterface } from "../models/UserModel";
import { comparePassword, getJWT, hashPassword } from "../utils";

const authRouter = Router();

// FORCE LOGIN & SHOW USERNAME
authRouter.get("/test", (req, res) => {
    res.send(`CONN_STRING: ${process.env.MONGO_CONNECTION_STRING}`);
});

// Register new user
authRouter.post("/register", async (req, res) => {
    const { username, password, name, email } = req.body;
    const isAdmin = 0;

    const existingUser = (await UsersDb.getUserByUsername(username))
        ? await UsersDb.getUserByEmail(email)
        : false;

    if (existingUser) {
        res.status(400).send(existingUser);
    } else {
        const hashedPassword = hashPassword(password);
        const user: UserInterface = {
            username,
            hashedPassword,
            name,
            email,
            isAdmin,
        };

        try {
            const userId = await UsersDb.insertUser(user);
            res.status(200).send({ userId });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    }
});

// LOGIN W/ EXISTING USER
authRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    const user = await UsersDb.getUserByUsername(username);

    if (user) {
        const correctPass = comparePassword(password, user.hashedPassword);

        if (correctPass) {
            const jwt = getJWT(username, user._id);
            res.status(200).send({
                token: jwt,
                username: user.username,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).send("Wrong Password");
        }
    } else {
        res.status(400).send("User don't exist");
    }
});

export default authRouter;
