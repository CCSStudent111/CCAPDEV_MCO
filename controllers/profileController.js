const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');
const tempuserhehe = require('../models/tempuserhehe');

//user login
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Ensure password is a string (prevent array issues)
        const plainPassword = Array.isArray(password) ? password[0] : password;

        // Retrieve user from database
        const user = await userModel.getuserUsername(username);

        if (!user) {
            return res.render('login', { 
                title: 'Login', 
                layout: 'loginLayout', 
                error: 'Invalid username or password' 
            });
        }

        console.log('Entered Password:', plainPassword);
        console.log('Stored Hashed Password:', user.password);

        // Compare password
        const isMatch = await bcrypt.compare(plainPassword, user.password);
        console.log('Password Match:', isMatch);

        if (isMatch) {
            // Store user in session
            // Make a clean copy of user to avoid potential serialization issues
            const sessionUser = {
                _id: user._id.toString(), // Ensure ID is a string
                username: user.username,
                email: user.email,
                joinDate: user.joinDate,
                posts: user.posts,
                comments: user.comments
            };
            
            // Set user in session directly and via helper
            req.session.user = sessionUser;
            tempuserhehe.setcurrentUser(req, sessionUser);
            
            console.log("User logged in successfully:", sessionUser.username);
            console.log("Session after login:", req.sessionID);
            
            // Save session explicitly before redirect
            req.session.save(err => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).render('login', {
                        title: 'Login',
                        layout: 'loginLayout',
                        error: 'Error creating session. Please try again.'
                    });
                }
                return res.redirect('/');
            });
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
            error: 'Server error. Please try again later.' 
        });
    }
}

async function register(req, res) {
    try {
        const { email, password, username } = req.body;

        // Ensure password is always a string
        const plainPassword = Array.isArray(password) ? password[0] : String(password);

        // Validate input
        if (!email || !plainPassword || !username) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
                error: 'All fields are required.' 
            });
        }

        // Check if username already exists
        const existingUser = await userModel.getuserUsername(username);
        if (existingUser) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
                error: 'This username is already used, please use another one.' 
            });
        }

        // Hash password correctly
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log('Plain Password:', plainPassword);
        console.log('Hashed Password:', hashedPassword);

        // Create user with complete profile data
        const userData = { 
            username, 
            password: hashedPassword, 
            email,
            joinDate: new Date(),
            posts: 0,
            comments: 0
        };
        
        // Save user
        const newUser = await userModel.createUser(userData);
        
        // Set user data in session (with ID from database)
        const sessionUser = {
            _id: newUser.insertedId.toString(),
            username: userData.username, 
            email: userData.email,
            joinDate: userData.joinDate,
            posts: userData.posts,
            comments: userData.comments
        };
        
        // Set user in session directly and via helper
        req.session.user = sessionUser;
        tempuserhehe.setcurrentUser(req, sessionUser);
        
        console.log("User registered successfully:", sessionUser.username);
        console.log("Session after registration:", req.sessionID);
        
        // Save session explicitly before redirect
        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).render('register', {
                    title: 'Register',
                    layout: 'loginLayout',
                    error: 'Error creating session. Please try again.'
                });
            }
            return res.redirect('/');
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('register', { 
            title: 'Register', 
            layout: 'loginLayout', 
            error: 'Server error. Please try again later.' 
        });
    }
}

// logout - clear the session
function logout(req, res) {
    console.log("Logging out user:", req.session.user ? req.session.user.username : "No user in session");
    
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error during logout. Please try again.');
        }
        // Clear any cookies
        res.clearCookie('connect.sid');
        res.render('logout', { title: 'Logout' });
    });
}

module.exports = {
    login,
    register,
    logout
};