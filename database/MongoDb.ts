import mongo from 'mongodb';
import Grid from 'gridfs-stream';
import { MongoClient } from 'mongodb';

export async function getDb() {
    const connectionString = process.env.MONGO_CONNECTION_STRING ?? ""
    
    if (connectionString.length === 0) {
        throw new Error("Invalid connection string")
    }

    const client = new MongoClient(connectionString);
    
    try {
        await client.connect();
    } catch (error) {
        console.log(error); 
    }
    
    const db = client.db(process.env.MONGO_DB_NAME);

    return db;
}