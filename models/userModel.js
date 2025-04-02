const { ObjectId } = require('mongodb');
const db = require('../db');
const collection = "users";

async function connect() {
    return await db.getCollection(collection);
}
// get users
async function getAllUsers() {
    const db = await connect();
    return await db.find({}).toArray();
}

//get user by username
async function getuserUsername(username) {
    const db = await connect();
    return await db.findOne({ username: username });
}

// create a new user
async function createUser(userData) {
    const db = await connect();
    
    // experimental timestamp and user data
    userData.joinDate = new Date();
    userData.posts = 0;
    userData.comments = 0;
    
    return await db.insertOne(userData);
}

// update user
async function updateUser(username, updates) {
    const db = await connect();
    return await db.updateOne({ username: username }, { $set: updates });
}

async function closeConnection() {
    await client.close();
}

module.exports = {
    getAllUsers,
    getuserUsername,
    createUser,
    updateUser,
    closeConnection
};
