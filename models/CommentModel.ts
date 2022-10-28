import { ObjectId } from "mongodb";

export default interface CommentModel {
    photoId: ObjectId,
    username: string,
    message: string
}