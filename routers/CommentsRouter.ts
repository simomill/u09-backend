import { Router } from "express";
import { Long, ObjectId, Timestamp } from "mongodb";
import { CommentsDb } from "../database/CommentsDb";
import CommentModel from "../models/CommentModel";

const commentsRouter = Router();

// GET ALL COMMENTS
commentsRouter.get("/", async (req, res) => {
    const result = await CommentsDb.getComments();

    res.send(result);
});

// POST NEW COMMENT
commentsRouter.post("/", async (req, res) => {
    const { message, photoId, username } = req.body;

    const comment: CommentModel = { message, photoId, username };

    const commentId = await CommentsDb.insertComment(comment)

    res.send({ commentId });
});

// DELETE COMMENT
commentsRouter.delete('/:id', async (req, res) => {
    const commentId = new ObjectId(req.params.id);

    try {
        const response = await CommentsDb.deleteComment(commentId);
        res.send(response);
    } catch (error) {
        console.log(error);
    }
    
});

export default commentsRouter;
