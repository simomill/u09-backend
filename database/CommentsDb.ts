import CommentModel from "../models/CommentModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "comments";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<CommentModel>(COLLECTION_NAME);
    return collection;
};

export const CommentsDb = {
    // GET ALL COMMENTS
    async getComments() {
        const collection = await getCollection();
        const comments = collection.find();
        return comments.toArray();
    },

    // MAKE NEW COMMENT
    async insertComment(comment: CommentModel) {
        const collection = await getCollection();

        const result = await collection.insertOne(comment);

        return result.insertedId;
    }
};


