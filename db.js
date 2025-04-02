// db.js - Modified version for MongoDB Atlas support
const { MongoClient } = require('mongodb');

// Use environment variable for MongoDB URI (will be set in Render.com)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";
const DB_NAME = process.env.DB_NAME || "forumdb";

// Create a MongoDB client with proper options for Atlas
const client = new MongoClient(MONGODB_URI, {
    // These options help with Atlas connectivity
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50, // Adjust based on expected load
    connectTimeoutMS: 30000
});

// Connect to database and get collection
async function getCollection(collectionName) {
    try {
        await client.connect();
        return client.db(DB_NAME).collection(collectionName);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
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
    DB_NAME
};