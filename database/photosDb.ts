import { ObjectId } from "mongodb";
import Photo, { PhotoInterface } from "../models/PhotoModel";
import PhotoModel from "../models/PhotoModel";
import UserModel from "../models/UserModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "photos";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<PhotoInterface>(COLLECTION_NAME);
    return collection;
}

export const PhotosDb = {
    // Get all photos
    async getPhotos() {
        const photos = Photo.find({});

        return photos;
    },

    // Get all photos by user X
    async getPhotosByUser(username: string) {    
        const photos = Photo.find({ username });
    
        return photos;
    },

    // Get specific photo
    async getPhoto(photoId: string) {    
        const photo = Photo.findOne({ _id: photoId });
    
        return photo;
    },

    // Save new photo
    async addPhoto(photo: PhotoInterface) {        
        const result = await Photo.create(photo);

        return result;
    },

    async deleteImageById(id: ObjectId) {
        try {
            const result = await Photo.findOneAndDelete({ _id: id });

            return "Image successfully removed"

        } catch (error) {
            return console.log(error);
        }
    }
}

