const userModel = require('../models/userModel');
const tempuserhehe = require('../models/tempuserhehe');

//user login
async function login(req, res) {
    try {
        const { password, username } = req.body;
        const user = await userModel.getuserUsername(username);
        
        const bcrypt = require('bcrypt');
        if (user && await bcrypt.compare(password, user.password)) {
            // Store complete user info in session
            req.session.user = {
                username: user.username,
                _id: user._id,
                email: user.email || '', // Add email field for consistency
                joinDate: user.joinDate,
                posts: user.posts,
                comments: user.comments
            };
            
            // Set session to persist if rememberMe is checked
            if (req.body.rememberMe) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            }
            
            return res.redirect('/'); 
        } else {
            return res.render('login', { 
                title: 'Login', 
                layout: 'loginLayout', 
                error: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { 
            title: 'Login', 
            layout: 'loginLayout', 
            error: 'An error occurred during login' 
        });
    }
}

//user reegistration
async function register(req, res) {
    try {
        const { password, username, email } = req.body;
        const existingUser = await userModel.getuserUsername(username);
        
        if (existingUser) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
                error: 'This username already exists, please try another name.' 
            });
        }
    
        const newUser = await userModel.createUser({ 
            username, 
            password,
            email: email || '' // Add email if provided
        });
        
        // Set the user in session with consistent structure
        req.session.user = {
            username,
            _id: newUser.insertedId,
            email: email || '',
            joinDate: new Date(),
            posts: 0,
            comments: 0
        };
        
        return res.redirect('/'); 
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('register', { 
            title: 'Register', 
            layout: 'loginLayout', 
            error: 'Server error. Please try again later.' 
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