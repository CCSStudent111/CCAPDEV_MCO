
function setcurrentUser(req, user) {
    if (!user) {
        console.warn("Attempted to set null/undefined user in session");
        return;
    }
    
    // Ensure we're dealing with string IDs
    const sessionUser = {
        _id: user._id ? user._id.toString() : null,
        username: user.username,
        email: user.email,
        joinDate: user.joinDate,
        posts: user.posts || 0,
        comments: user.comments || 0
    };
    
    req.session.user = sessionUser;
    console.log(`User set in session: ${sessionUser.username} with ID: ${sessionUser._id}`);
    
    // Force session save
    if (req.session.save) {
        req.session.save(err => {
            if (err) console.error("Error saving session:", err);
            else console.log("Session saved successfully");
        });
    }
}

function getcurrentUser(req) {
    if (!req || !req.session) {
        console.warn("Request or session object is undefined");
        return null;
    }
    
    return req.session.user || null;
}

module.exports = {
    setcurrentUser,
    getcurrentUser
};