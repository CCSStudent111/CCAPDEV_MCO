const userModel = require('../models/userModel');
const tempuserhehe = require('../models/tempuserhehe');

//user login
async function login(req, res) {
    try {
        const { password, username } = req.body;
        const user = await userModel.getuserUsername(username);
        
        const bcrypt = require('bcrypt');
        if (user && await bcrypt.compare(password, user.password)) {
            // Store user info in session instead of global variable
            req.session.user = {
                username: user.username,
                _id: user._id,
                joinDate: user.joinDate,
                posts: user.posts,
                comments: user.comments
            };
            return res.redirect('/'); 
        } else {
            return res.render('login', { 
                title: 'Login', 
                layout: 'loginLayout', 
                error: 'invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { 
            title: 'Login', 
            layout: 'loginLayout', 
            error: 'error..' 
        });
    }
}

//user reegistration
async function register(req, res) {
    try {
        const { password, username } = req.body;
        const existingUser = await userModel.getuserUsername(username);
        
        if (existingUser) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
                error: 'the username already exists, please try another name.' 
            });
        }
    
        const newUser = await userModel.createUser({ username, password });
        
        // Set the user in session instead of global variable
        req.session.user = {
            username,
            _id: newUser.insertedId,
            joinDate: new Date(),
            posts: 0,
            comments: 0
        };
        
        return res.redirect('/'); 
    } catch (error) {
        console.error('registration error:', error);
        res.status(500).render('register', { 
             title: 'Register', 
            layout: 'loginLayout', 
            error: 'server error. Please try again later.' 
        });
    }
}

// logout
function logout(req, res) {
    // Clear the session instead of global variable
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.render('logout', { title: 'Logout' });
    });
}

module.exports = {
    login,
    register,
    logout
};