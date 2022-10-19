import { ObjectId } from "mongodb";

export default interface PhotoModel{
    filename: string,
    username: string,
    title: string,
    img: {
        data: Buffer,
        contentType: String
    }

}