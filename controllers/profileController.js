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
            tempuserhehe.setcurrentUser(req, user);
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
        userData._id = newUser.insertedId;
        tempuserhehe.setcurrentUser(req, userData);

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

// logout - clear the session
function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.render('logout', { title: 'Logout' });
    });
}

module.exports = {
    login,
    register,
    logout
};