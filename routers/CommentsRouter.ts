import { Router } from "express";
import { Long, Timestamp } from "mongodb";
import { CommentsDb } from "../database/CommentsDb";
import CommentModel from "../models/CommentModel";

const commentsRouter = Router();

// GET ALL COMMENTS
commentsRouter.get("/", async (req, res) => {
    const result = await CommentsDb.getComments();

    res.send(result);
});

commentsRouter.post("/", async (req, res) => {
    const { message, photoId, username } = req.body;

    const comment: CommentModel = { message, photoId, username };

    const commentId = await CommentsDb.insertComment(comment)

    res.send({ commentId });
});

export default commentsRouter;
