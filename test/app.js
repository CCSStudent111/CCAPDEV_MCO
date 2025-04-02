const express = require('express');
const server = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./models/dbInit');
const tempuserhehe = require('./models/tempuserhehe');

//Initialize and reset the sample data, this will reset the state. comment this out if you want the data to not be reset when running app.js againn
initializeDatabase().catch(console.error);

//controller files
const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');

server.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
server.set('view engine', 'hbs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());


server.use((req, res, next) => {
    res.locals.currentUser = tempuserhehe.getcurrentUser();
    next();
});

//access page
server.get('/', postController.viewallPost);
server.get('/login', (req, res) => res.render('login', { title: 'Login', layout: 'loginLayout' }));
server.get('/register', (req, res) => res.render('register', { title: 'Register', layout: 'loginLayout' }));
server.get('/logout', authController.logout);
server.get('/post/:id', postController.getpostID);

//access registration
server.post('/login', authController.login);
server.post('/register', authController.register);

//access posts 
server.post('/post/create', postController.createPost);
server.post('/post/update/:id', postController.updatePost);
server.post('/post/delete/:id', postController.deletePost);
server.post('/post/like/:id', postController.likePost);
server.post('/post/dislike/:id', postController.dislikePost);
server.get('/post/edit/:id', postController.editPost);

//access comments 
server.post('/comment/add', commentController.addComment);
server.post('/comment/edit/:id', commentController.editComment);
server.post('/comment/delete/:id', commentController.deleteComment);

server.listen(3000, () => console.log("Server running on port 3000"));