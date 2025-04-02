// db.js - Modified version
const { MongoClient } = require('mongodb');

// Use environment variable or fall back to local for development
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";
const DB_NAME = "forumdb";

// Create a MongoDB client that can be reused
const client = new MongoClient(MONGODB_URI);

// Connect to database and get collection
async function getCollection(collectionName) {
    await client.connect();
    return client.db(DB_NAME).collection(collectionName);
}

// Function to close connection
async function closeConnection() {
    await client.close();
}

// Handle process termination
function signalHandler() {
    console.log("Closing MongoDB Connection...");
    client.close()
        .then(() => {
            console.log("MongoDB Connection Closed");
            process.exit();
        })
        .catch(err => {
            console.error("Error closing MongoDB connection:", err);
            process.exit(1);
        });
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);

module.exports = {
    getCollection,
    closeConnection,
    client,
    DB_NAME  // Export DB_NAME
};