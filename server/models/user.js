var mongoose=require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'vadne123').toString();

    user.tokens = user.tokens.concat({ access, token });
    
    return user.save().then(()=> {
        return token;
    });
};

var User = mongoose.model('User', userSchema);  // our model

module.exports = {User};