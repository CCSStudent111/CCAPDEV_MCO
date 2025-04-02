const bcrypt = require("bcrypt");
const db = require('../db');

const databaseName = "forumdb";
const usersCollection = "users";
const postsCollection = "posts";
const commentsCollection = "comments";

// Initialize the database
async function initializeDatabase() {
    try {
        await db.client.connect();
        console.log('Connected to MongoDB');
        
        const dbObj = db.client.db(databaseName);
        
        // Rest of your initialization code
        // ...
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        // Don't close the connection here since other parts of the app need it
    }
}

module.exports = { initializeDatabase };