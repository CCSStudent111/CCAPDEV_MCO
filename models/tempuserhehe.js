// Update user management to work with sessions
function setcurrentUser(req, user) {
    req.session.user = user;
}

function getcurrentUser(req) {
    return req.session.user || null;
}

module.exports = {
    setcurrentUser,
    getcurrentUser
};