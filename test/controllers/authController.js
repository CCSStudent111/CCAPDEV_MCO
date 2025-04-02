const userModel = require('../models/userModel');
const tempuserhehe = require('../models/tempuserhehe');

//user login
async function login(req, res) {
    try {
        const { password, username} = req.body;
        //user in database
        const user = await userModel.getuserUsername(username);
        // checker if
        // user exists and
        // password is correct
        
        if (user && user.password === password) {
            // set the temp user globally (no session management for now for multiple client handling)
            tempuserhehe.setcurrentUser(user);
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
        const { password, username} = req.body;
       //checker if username exist
        const existingUser = await userModel.getuserUsername(username);
        
        if (existingUser) {
            return res.render('register', { 
                title: 'Register', 
                layout: 'loginLayout', 
                error: 'the username already exists, please try another name.' 
            });
        }
    
        const newUser = await userModel.createUser({ username, password });
        
        // Set the current user after registration
        tempuserhehe.setcurrentUser({
            username,
            password,
            _id: newUser.insertedId,
            joinDate: new Date(),
            posts: 0,
            comments: 0
        });
        
        //redirect to home page instead of login
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
    tempuserhehe.setcurrentUser(null);
    res.render('logout', { title: 'Logout' });
}

module.exports = {
    login,
    register,
    logout
};