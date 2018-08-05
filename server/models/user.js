var mongoose=require('mongoose');

// CREATE MODEL
var userSchema ={     // advanced schema
    name: {
        type: String,  // what to-do
        required: true, // required validator
        minlength: 3,   // custom validator
        trim: true      // removes leading or trailing white space
    },
    email: {
        type: String,  
        required: true, // required validator
        minlength: 3,   // custom validator
        trim: true      // removes leading or trailing white space
    }
};
var User = mongoose.model('User', userSchema);  // our model

module.exports = {User};