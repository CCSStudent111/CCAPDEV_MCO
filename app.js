/*
 * MCO2 Web Forum
 * 
 * Members:                    Section:
 * Jandeil Dural                    N01
 * Dion Mel Cubarrubias             N01
 * Justin Patrick De Grano          N01
 * Dlareinnej Jherby C. Jaime       S15
 * 
 * 
*/

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./models/dbInit');
const db = require('./db');
const app = express();

// Initialize database only in development
if (process.env.NODE_ENV !== 'production') {
    initializeDatabase().catch(console.error);
}

// Middleware to parse incoming request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set up session middleware with MongoStore for persistent sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/forumdb",
        ttl: 14 * 24 * 60 * 60, // = 14 days
        autoRemove: 'native',
        // Remove crypto option as it's causing issues
    }),
    cookie: {
        httpOnly: true, 
        secure: false, // Set to false for now to troubleshoot
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
        sameSite: 'lax'
    }
}));

//controller files
const profileController = require('./controllers/profileController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');

// Add a route to check session status
app.get('/session-check', (req, res) => {
    res.json({
        sessionID: req.sessionID,
        hasSession: !!req.session,
        user: req.session.user || 'No user in session',
        cookies: req.headers.cookie
    });
});

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Debug middleware - log session data
app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("Session User:", req.session.user ? req.session.user.username : 'No user in session');
    next();
});

// Pass user from session to locals for templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

//access page
app.get('/', postController.viewallPost);
app.get('/login', (req, res) => {
    // If already logged in, redirect to home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { title: 'Login', layout: 'loginLayout' });
});
app.get('/register', (req, res) => {
    // If already logged in, redirect to home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { title: 'Register', layout: 'loginLayout' });
});
app.get('/logout', profileController.logout);
app.get('/post/:id', postController.getpostID);

//access registration and login
app.post('/login', profileController.login);
app.post('/register', profileController.register);

//access posts 
app.post('/post/create', postController.createPost);
app.post('/post/update/:id', postController.updatePost);
app.post('/post/delete/:id', postController.deletePost);
app.post('/post/like/:id', postController.likePost);
app.post('/post/dislike/:id', postController.dislikePost);
app.get('/post/edit/:id', postController.editPost);

//access comments 
app.post('/comment/add', commentController.addComment);
app.post('/comment/edit/:id', commentController.editComment);
app.post('/comment/delete/:id', commentController.deleteComment);

// Middleware to protect routes (ensure the user is authenticated)
function authenticateSession(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Protected routes example
app.get('/profile', authenticateSession, (req, res) => {
    res.render('profile', { title: 'Your Profile', user: req.session.user });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Application error:", err);
    res.status(500).send('Something went wrong! Please try again later.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});