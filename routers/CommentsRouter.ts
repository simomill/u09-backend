import { Router } from "express";
import { Long, ObjectId, Timestamp } from "mongodb";
import { CommentsDb } from "../database/CommentsDb";
import CommentModel from "../models/CommentModel";

const commentsRouter = Router();

// GET ALL COMMENTS
commentsRouter.get("/", async (req, res) => {
    try {
        const result = await CommentsDb.getComments().then(() => {
        res.status(200).send(result);
    });
    } catch (error) {
        res.status(400).send(error);
    } 
});

// POST NEW COMMENT
commentsRouter.post("/", async (req, res) => {
    const { message, photoId, username } = req.body;

    const comment: CommentModel = { message, photoId, username };

    try {
        const commentId = await CommentsDb.insertComment(comment).then(() => {
            res.status(200).send({ commentId });
        })
    } catch (error) {
        res.status(400).send(error);
    }
    
});

// DELETE COMMENT
commentsRouter.delete('/:id', async (req, res) => {
    const commentId = new ObjectId(req.params.id);

    try {
        const response = await CommentsDb.deleteComment(commentId).then(() => {
           res.status(200).send(response); 
        });
        
    } catch (error) {
        res.status(400).send(error)
    }
    
});

export default commentsRouter;
