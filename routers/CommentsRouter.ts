import { Router } from "express";
import { Long, ObjectId, Timestamp } from "mongodb";
import { CommentsDb } from "../database/CommentsDb";
import CommentModel, { CommentInterface } from "../models/CommentModel";

const commentsRouter = Router();

// GET ALL COMMENTS
commentsRouter.get("/", async (req, res) => {
    const result = await CommentsDb.getComments();

    if (result) res.status(200).send(result);
});

// POST NEW COMMENT
commentsRouter.post("/", async (req, res) => {
    const { message, photoId, username } = req.body;

    const comment: CommentInterface = { message, photoId, username };

    const result = await CommentsDb.insertComment(comment);

    if (result) res.status(200).send({ result });
});

// DELETE COMMENT
commentsRouter.delete("/:id", async (req, res) => {
    const commentId = new ObjectId(req.params.id);

    const result = await CommentsDb.deleteComment(commentId);

    if (result) res.status(200).send(result);
});

export default commentsRouter;
