import mongoose from "mongoose";

const connectDb = async () => {
    const uri = process.env.MONGO_CONNECTION_STRING;
    let connMsg = "";

    if (uri) {
        await mongoose.connect(uri, { dbName: "dsplay-auth" }).then(
            (res) => {
                const connection = mongoose.connection;
                connMsg = `Connected to ${connection.db.databaseName}`;
                return console.log(connMsg), connection;
            },
            (err) => {
                connMsg = `Connection failed: ${err}`;
                return console.log(connMsg);
            }
        );
    }
};

export { connectDb };
