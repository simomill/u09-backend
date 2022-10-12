import {config} from "dotenv"; config()
import express from 'express';
import { authUser } from "./middelwares";
import authRouter from './routers/AuthRouter';

// APP AND MIDDLEWARE SETUP
const app = express();
app.use(express.json());
app.use(authUser);

app.get('/', (req, res) => {
    console.log(res.locals.user);
    res.send("Hello World");
});

app.use('/auth', authRouter);

const server_port = process.env.PORT || 3000;

app.listen(server_port, () => {
    console.log(`Server started on http://localhost:${server_port}`);
})