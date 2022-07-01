function requireUser(req, res, next) {
    if(!req.user) {
        next({
            name: "MissingUserError", 
            message: "You muse be logged in to perform this action"
        });
    }

    next(); 
}

module.exports = {
    requireUser
}