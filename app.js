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

const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./models/dbInit');
const tempuserhehe = require('./models/tempuserhehe');
const app = express();


//Initialize and reset the sample data, this will reset the state. comment this out if you want the data to not be reset when running app.js againn
initializeDatabase().catch(console.error);

// Middleware to parse incoming request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_secret_key',  // Better to use environment variable
    resave: false,
    saveUninitialized: false,  // Changed to false for better security
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }
}));

// Initialize MongoDB connection
async function connectToDB() {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(databaseName);
}


//controller files
const profileController = require('./controllers/profileController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');

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


app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

//access page
app.post('/post/create', isAuthenticated, postController.createPost);
app.post('/post/update/:id', isAuthenticated, postController.updatePost);
app.post('/post/delete/:id', isAuthenticated, postController.deletePost);
app.get('/', postController.viewallPost);
app.get('/login', (req, res) => res.render('login', { title: 'Login', layout: 'loginLayout' }));
app.get('/register', (req, res) => res.render('register', { title: 'Register', layout: 'loginLayout' }));
app.get('/logout', profileController.logout);
app.get('/post/:id', postController.getpostID);

//access registration
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

// Login Route - Handles user authentication
app.post('/login', async (req, res) => {
    const { username, password, rememberMe } = req.body;  // rememberMe is true or false

    // Use your db module
    const db = require('./db');

    const user = await db.collection(usersCollection).findOne({ username });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user session data (user information)
    req.session.user = { username: user.username, email: user.email };

    // Adjust session expiration based on "Remember Me" flag
    if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;  // 30 days
    } else {
        req.session.cookie.maxAge = 15 * 60 * 1000;  // 15 minutes
    }

    res.status(200).json({ message: 'Login successful' });
});

// Middleware to protect routes (ensure the user is authenticated)
function authenticateSession(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' }); // return status 401 (meaning unauthorized user)
    }
    next();
}

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Profile Route - Only accessible to authenticated users
app.get('/profile', authenticateSession, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile', user: req.session.user });
});

// Logout Route - Destroys the session
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');  // Clear session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Start the Express server
/*
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});*/


// server.listen(3000, () => console.log("Server running on port 3000"));
