//temporary storage of current user
let currentUser = null;

//set the temporary user
function setcurrentUser(user) {
    currentUser = user;
}

function getcurrentUser() {
    return currentUser;
}

module.exports = {
    setcurrentUser,
    getcurrentUser
};