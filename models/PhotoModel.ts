import { Map, ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface PhotoInterface {
    filename: string;
    username: string;
    title: string;
    img: {
        data: Buffer;
        contentType: String;
    };
}

const PhotoSchema: Schema = new Schema<PhotoInterface>({
    filename: { type: String, required: true },
    username: { type: String },
    title: { type: String },
    img: {
        type: Object,
        nested: {
            data: { type: Buffer },
            contentType: { type: String },
        },
    },
});

const Photo = mongoose.model<PhotoInterface>("Photo", PhotoSchema, "photos");

export default Photo;
