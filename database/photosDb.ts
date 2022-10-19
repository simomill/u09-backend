import PhotoModel from "../models/PhotoModel";
import UserModel from "../models/UserModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "photos";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<PhotoModel>(COLLECTION_NAME);
    return collection;
}

export const PhotosDb = {
    // Get all photos
    async getPhotos() {
        const collection = await getCollection();

        const photos = collection.find();

        return photos.toArray();
    },

    // Get all photos by user X
    async getPhotosByUser(username: string) {
        const collection = await getCollection();
    
        const photos = collection.find({ username });
    
        return photos.toArray();
    },

    // Get specific photo
    async getPhoto(photoId: string) {
        const collection = await getCollection();
    
        const photo = collection.findOne({ photoId });
    
        return photo;
    },

    // Save new photo
    async addPhoto(photo: PhotoModel) {
        const collection = await getCollection();
        
        const result = await collection.insertOne(photo);

        return result.insertedId;
    }
}

