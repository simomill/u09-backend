import UserModel from "../models/UserModel";
import { getDb } from "./MongoDb";

const COLLECTION_NAME = "users";

async function getCollection() {
    const db = await getDb();
    const collection = db.collection<UserModel>(COLLECTION_NAME);
    return collection;
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

        return users.toArray();
    },


}