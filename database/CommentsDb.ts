import { ObjectId } from "mongodb";
import  Comment, { CommentInterface } from "../models/CommentModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "comments";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<CommentInterface>(COLLECTION_NAME);
    return collection;
};

export const CommentsDb = {
    // GET ALL COMMENTS
    async getComments() {
        const comments = Comment.find({});
        return comments;
    },

    // MAKE NEW COMMENT
    async insertComment(comment: CommentInterface) {
        const result = await Comment.create(comment);

        return result;
    },

    // DELETE COMMENT BY ID
    async deleteComment(commentId: ObjectId) {
        const result = await Comment.findOneAndDelete({_id: commentId});

        return result;
    }
};


