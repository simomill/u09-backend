import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface CommentInterface {
    photoId: ObjectId;
    username: string;
    message: string;
}

const CommentSchema: Schema = new Schema<CommentInterface>({
    photoId: { type: ObjectId },
    username: { type: String },
    message: { type: String}
});

const Comment = mongoose.model<CommentInterface>("Comment", CommentSchema, "comments");

export default Comment;
