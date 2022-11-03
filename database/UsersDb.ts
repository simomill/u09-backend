import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import UserModel from "../models/UserModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "users";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<UserModel>(COLLECTION_NAME);
    return collection;
}

export interface updateData {
    name?: string;
    username?: string;
    email?: string;
}

export const UsersDb = {
    // CREATE NEW USER
    async insertUser(user: UserModel) {
        const collection = await getCollection();

        const result = await collection.insertOne(user);

        return result.insertedId;
    },

    // FIND USER
    async getUserByUsername(username: string) {
        const collection = await getCollection();

        const user = collection.findOne({ username });

        return user;
    },

    // GET ALL USERS
    async getUsers() {
        const collection = await getCollection();

        const users = collection.find();

        return users;
    },

    // NOT YET CREATED
    async addImage(image: UploadedFile, username: string) {
        const collection = await getCollection();

        const user = collection.updateOne({ username }, { image });

        return user;
    },

    // REMOVE USER WITH USERNAME
    async removeUser(userName: string) {
        const collection = await getCollection();

        const result = await collection.findOneAndDelete({
            username: userName,
        });

        return result;
    },

    // UPDATE USER WITH ID
    async updateUser(userId: ObjectId, data: updateData) {
        const collection = await getCollection();
        console.log(data);

        try {
            const result = await collection.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        name: data.name,
                        username: data.username,
                        email: data.email,
                    },
                },
                { returnDocument: "after" }
            );

            return result;
        } catch (error) {
            console.log(error);
        }
    },

    // CHANGE USER ROLE BY ID
    async changeRole(userId: ObjectId, newRole: number) {
        const collection = await getCollection();

        try {
            const result = collection.findOneAndUpdate(
                { _id: userId },
                {
                    $set: { isAdmin: newRole },
                },
                { returnDocument: "after" }
            );

            return result;

        } catch (error) {
            console.log(error);
        }
    },
};
