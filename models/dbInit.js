const bcrypt = require("bcrypt");
const db = require('../db');

const usersCollection = "users";
const postsCollection = "posts";
const commentsCollection = "comments";

// Sample data
const sampleUsers = [
    { username: "Anime_Girl79", password: "kiritolover", email: "anime@example.com", joinDate: new Date(), posts: 2, comments: 3 },
    { username: "Brainrot", password: "ohiorizzler45", email: "brain@example.com", joinDate: new Date(), posts: 1, comments: 1 },
    { username: "Hater", password: "noluv4u", email: "hater@example.com", joinDate: new Date(), posts: 0, comments: 5 },
    { username: "Randymarsh", password: "southpark123", email: "randy@example.com", joinDate: new Date(), posts: 3, comments: 2 },
    { username: "Skibidi", password: "wh4tth3s1gma", email: "skibidi@example.com", joinDate: new Date(), posts: 0, comments: 0 }
];

const samplePosts = [
    { 
        title: "I NEED HELP",
        content: "Can someone please help me with my assignment? I'm stuck on question 3.",
        author: "Brainrot",
        category: "text",
        tags: ["#subject", "#help", "#study"],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 5,
        dislikes: 2
    },
    { 
        title: "Best professor for CSARCH2?",
        content: "Looking for recommendations for CSARCH2 professors. Who's the best in terms of teaching and grading?",
        author: "Anime_Girl79",
        category: "text",
        tags: ["#prof", "#subject"],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 12,
        dislikes: 0
    },
    { 
        title: "Campus drama - You won't believe what happened today!",
        content: "I saw someone steal food from the cafeteria today. Should I report them?",
        author: "Randymarsh",
        category: "text",
        tags: ["#drama", "#rant"],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 8,
        dislikes: 3
    },
    { 
        title: "Study group for finals?",
        content: "Anyone want to form a study group for the upcoming finals? We can meet at the library.",
        author: "Anime_Girl79",
        category: "text",
        tags: ["#study", "#help"],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 15,
        dislikes: 0
    },
    { 
        title: "This professor is terrible!",
        content: "I'm in this class and the professor never explains anything clearly. Anyone else feeling the same?",
        author: "Randymarsh",
        category: "text",
        tags: ["#prof", "#rant"],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 20,
        dislikes: 5
    }
];

const sampleComments = [
    {
        postId: "", 
        author: "StrongHelper",
        content: "Ok I will help!",
        createdAt: new Date()
    },
    {
        postId: "", 
        author: "Brainrot",
        content: "frfr",
        createdAt: new Date()
    },
    {
        postId: "", 
        author: "Hater",
        content: "Just figure it out yourself lol",
        createdAt: new Date()
    },
    {
        postId: "", 
        author: "Anime_Girl79",
        content: "I had that professor too. Try watching YouTube tutorials, they helped me a lot!",
        createdAt: new Date()
    },
    {
        postId: "",
        author: "Hater",
        content: "You're overreacting. The professor is fine.",
        createdAt: new Date()
    }
];

// Initialize the database
async function initializeDatabase() {
    try {
        await db.client.connect();
        console.log('Connected to MongoDB');
        
        const dbObj = db.client.db(db.DB_NAME);
        
        // Use the dbObj to access collections
        const usersCount = await dbObj.collection(usersCollection).countDocuments();
        const postsCount = await dbObj.collection(postsCollection).countDocuments();
        const commentsCount = await dbObj.collection(commentsCollection).countDocuments();

        if (usersCount === 0) {
            const hashedUsers = await hashPasswords(sampleUsers);
            await dbObj.collection(usersCollection).insertMany(hashedUsers);
        }
        if (postsCount === 0) {
            const postsResult = await dbObj.collection(postsCollection).insertMany(samplePosts);
            const postIds = Object.values(postsResult.insertedIds);

            // Update sample comments with post IDs
            sampleComments[0].postId = postIds[0].toString();
            sampleComments[1].postId = postIds[0].toString();
            sampleComments[2].postId = postIds[1].toString();
            sampleComments[3].postId = postIds[2].toString();
            sampleComments[4].postId = postIds[4].toString();

            if (commentsCount === 0) {
                await dbObj.collection(commentsCollection).insertMany(sampleComments);
            } 
        }
    }
    catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        // Don't close the connection here since other parts of the app need it
    }
}

// You need to implement the hashPasswords function
async function hashPasswords(users) {
    const hashedUsers = [];
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        hashedUsers.push({
            ...user,
            password: hashedPassword
        });
    }
    return hashedUsers;
}

module.exports = { initializeDatabase };