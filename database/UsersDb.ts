import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import User, { UserInterface } from "../models/UserModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "users";

export async function getCollection() {
    const db = await getDb();
    const collection = db.collection<UserInterface>(COLLECTION_NAME);
    return collection;
}

export interface updateData {
    name?: string;
    username?: string;
    email?: string;
}

export const UsersDb = {
    // CREATE NEW USER
    async insertUser(user: UserInterface) {

        const result = await User.create(user);

        return result;
    },

    // FIND USER
    async getUserByUsername(username: string) {
        const user = User.findOne({ username });

        return user;
    },

    // Find USER W/ EMAIL
    async getUserByEmail(email: string) {
        const user = User.findOne({ email: email })
        
        return user;
    },

    // GET ALL USERS
    async getUsers() {
        const users = User.find({});


        return users;
        
        
    },

    // NOT YET IMPLEMENTED
    async addImage(image: UploadedFile, username: string) {
        const user = User.updateOne({ username }, { image });

        return user;
    },


    // REMOVE USER WITH USERNAME
    async removeUser(userName: string) {
        const result = await User.findOneAndDelete({
            username: userName,
        });

        return result;
    },

    // UPDATE USER WITH ID
    async updateUser(userId: ObjectId, data: updateData) {
        try {
            const result = User.findOneAndUpdate(
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
            return console.log(error);
        }
    },

    // CHANGE USER ROLE BY ID
    async changeRole(userId: ObjectId, newRole: number) {

        try {
            const result = User.findOneAndUpdate(
                { _id: userId },
                {
                    $set: { isAdmin: newRole },
                },
                { returnDocument: "after" }
            );

            return result;

        } catch (error) {
            return console.log(error);
        }
    },
};
