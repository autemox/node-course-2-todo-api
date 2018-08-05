var mongoose=require('mongoose');

// CREATE MODEL
var todoSchema ={     // advanced schema
    text: {
        type: String,  // what to-do
        required: true, // required validator
        minlength: 3,   // custom validator
        trim: true      // removes leading or trailing white space
    },
    completed: {
        type: Boolean,  // if the to-do was completed
        default: false  // if not specified, defaults to this value
    },
    completedAt: {
        type: Number,  // when the to-do was completed
        default: null
    }
};
var Todo = mongoose.model('Todo', todoSchema);  // our model

module.exports = {Todo};