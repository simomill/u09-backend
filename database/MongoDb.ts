import { MongoClient } from "mongodb";
const mongo = require('mongodb');
import Grid from 'gridfs-stream';

export async function getDb() {
    const connectionString = process.env.MONGO_CONNECTION_STRING ?? ""

    if (connectionString.length === 0) {
        throw new Error("Invalid connection string")
    }

    const client = new MongoClient(connectionString);
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME);

    const gfs = Grid(db, mongo)

    return db;
}