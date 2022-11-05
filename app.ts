import { config } from "dotenv";
config();
import express from "express";
import expressFileUpload, { UploadedFile } from "express-fileupload";
import { addTest, UserData } from "./UserData";
import { getUniqueFilename } from "./utils";
import { authUser } from "./middelwares";
import authRouter from "./routers/AuthRouter";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import usersRouter from "./routers/UserRouter";
import Grid from "gridfs-stream";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import commentsRouter from "./routers/CommentsRouter";
import { connectDb } from "./database/conn";

const corsOptions: CorsOptions = {
    origin: ["http://localhost:8000", "https://dsplayapp.netlify.app"],
    credentials: true
}

// APP AND MIDDLEWARE SETUP
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(authUser);

app.get("/", (req, res) => {
    console.log(res.locals.user);
    res.send("Hello World");
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);

const server_port = process.env.PORT || 3000;

app.listen(server_port, () => {
    console.log(`Server started on http://localhost:${server_port}`);
});

connectDb();