var {User} =require('./../models/user');

// custom middleware
var authenticate = (req, res, next) => {

    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {  // CUSTOM PROMISE takes token value and finds appropriate user related to the token
        if(!user) return Promise.reject('Token valid but no user found.');

        req.user=user;
        req.token=token;
        next();
    }).catch((e) => res.status(401).send());
};

module.exports = {authenticate};