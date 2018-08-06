var mongoose=require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt=require('bcryptjs');

// CREATE MODEL
var userSchema = new mongoose.Schema({     // advanced schema
    name: {
        type: String,    // what to-do
        required: true,  // required validator
        minlength: 3,    // custom validator
        trim: true,      // removes leading or trailing white space
        unique: true     // wont allow more than one user to have same name
    },
    email: {
        type: String,  
        required: true, 
        minlength: 3,  
        trim: true,     
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
                type: String,
                required: true
        },
        token: {
                type: String,
                required: true
        }
    }]
});

// override method that turns this object into JSON to prevent sensitive data from being JSONfied and sent over internet
userSchema.methods.toJSON = function () {
    var user = this;

    var userObject = user.toObject();               // create a regular object where only properties exist
    return _.pick(userObject, ['_id', 'email']);    // pick off the variables that are not sensitive and are OK to send through JSON across the internet
};

// custom method that generates auth token
userSchema.methods.generateAuthToken = function () {   
    var user = this;        // this is the individual document (unlike userSchema.statics, would be model binding)

    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'vadne123').toString();

    user.tokens = user.tokens.concat({ access, token });
    
    return user.save().then(()=> {
        return token;
    }).catch((e) => console.log("[user.js] generateAuthToken(): Unable to save token"));
};

// custom static method that returns promise, tries to find user by token
userSchema.statics.findByToken = function(token) {   // .statics is an object like .methods but everything in it turns into a models method instead of a instances method
    var User = this;  // this is bound to model not the invidual instance
    
    var decoded; // stores the decoded jwt values
    try {
        decoded = jwt.verify(token, 'vadne123'); // throws error if secret doesnt match or token value manipulated, which is why its in a try, catch
    } catch(e) {// something failed
        return Promise.reject('invalid token'); // return a rejected promise
    }

    return User.findOne({   // find associated user if any.  RETURNS A PROMISE
        _id: decoded._id,
        'tokens.token': token,    // always use '' around NESTED object properties (ie. when there are . symbols)
        'tokens.access': 'auth'   // must match everything: the user, the token proving its them, and the level of authorization!
    });
};

// custom static method that returns a promise
userSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    return User.findOne( {email} ).then((user)=> {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {

            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                }
                else reject();
           });
        });
    }).catch((e) => {
        return Promise.reject();
    });
};

// this middleware runs before save()
userSchema.pre('save', function(next) {
    var user=this;

    if(user.isModified('password')) {  // checks to see if password is modified in this save()
        // hash the password
        bcrypt.genSalt(5, (err, salt) => {  // bigger number = takes longer on purpose to prevent brute force
    
            bcrypt.hash(user.password, salt, (err, hash) => {    // combines password and salt to make a hash
        
                user.password=hash;  // store hash in your db instead of password.  has built in salt to prevent hash mining
                next();
            });
        }); 
    }
    else next();
});

var User = mongoose.model('User', userSchema);  // our model

module.exports = {User};