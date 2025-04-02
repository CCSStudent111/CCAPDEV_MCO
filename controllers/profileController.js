const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');

//user login
// Make sure the login function correctly sets the session
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Ensure password is a string (prevent array issues)
        const plainPassword = Array.isArray(password) ? password[0] : password;

        // Retrieve user from database
        const user = await userModel.getuserUsername(username);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        
        const bcrypt = require('bcrypt');
        if (user && await bcrypt.compare(password, user.password)) {
            // Store user info in session
            req.session.user = {
                username: user.username,
                _id: user._id,
                email: user.email || '',
                joinDate: user.joinDate,
                posts: user.posts,
                comments: user.comments
            };
            
            // Set session to persist if rememberMe is checked
            if (req.body.rememberMe) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
            }
            
            // Redirect after successful login
            return res.redirect('/'); 
=======
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)

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
            tempuserhehe.setcurrentUser(user);
            return res.redirect('/');
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            error: 'An error occurred during login' 
=======
            error: 'Server error. Please try again later.' 
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
            error: 'Server error. Please try again later.' 
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
            error: 'Server error. Please try again later.' 
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
        });
    }
}

async function register(req, res) {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        const { password, username, email } = req.body;
=======
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
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
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
        const existingUser = await userModel.getuserUsername(username);
        if (existingUser) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
                error: 'This username is already used, please use another one.' 
            });
        }
=======
                error: 'This username is already used, please use another one.' 
            });
        }
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
                error: 'This username is already used, please use another one.' 
            });
        }
>>>>>>> parent of 5099ab2 (changed controllers and app.js)

        // Hash password correctly
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log('Plain Password:', plainPassword);
        console.log('Hashed Password:', hashedPassword);

        // Save user
        const newUser = await userModel.createUser({ 
            username, 
            password: hashedPassword, 
            email 
        });

        // Set the current user
        tempuserhehe.setcurrentUser({
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
            username,
            email, 
            password: hashedPassword,
            _id: newUser.insertedId,
            email: email || '',
            joinDate: new Date(),
            posts: 0,
            comments: 0
        });

        // Redirect to home page
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/login');
    });
=======
    tempuserhehe.setcurrentUser(null);
    res.render('logout', { title: 'Logout' });
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
    tempuserhehe.setcurrentUser(null);
    res.render('logout', { title: 'Logout' });
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
=======
    tempuserhehe.setcurrentUser(null);
    res.render('logout', { title: 'Logout' });
>>>>>>> parent of 5099ab2 (changed controllers and app.js)
}

module.exports = {
    login,
    register,
    logout
};