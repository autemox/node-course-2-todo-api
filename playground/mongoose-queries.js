const {mongoose} = require('./../server/db/mongoose');  // our custom
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id='5b647c273eec6a45f036c8ef';
User.findById(id).then((user)=> {                  // search by ID
    if(!user) return console.log('Not found.');    // failed to find

    console.log(User);                             // found the user
}, (e) => console.log(e));                         // invalid id

/*
var id="5b6521e4533f440eb04835f4";

if(!ObjectID.isValid(id)) console.log("ID not valid");
Todo.find({ 
    _id: id                            // its ok to send string to mongoose functions
}).then((todos) => {                   // get an array back even if only 1 is found
    if(todos.length==0) return console.log("Not found.");

    console.log('find()', todos);      // found by ID
}).catch((e) => console.log("Invalid ID: "+e));

Todo.findOne({ 
    _id: id                           // its ok to send string to mongoose functions
}).then((todo) => {                   // didnt get an array of documents, just the first found
    if(!todo) return console.log("Not found.");

    console.log('findOne()', todo);   // found by ID
}).catch((e) => console.log(e));

Todo.findById(id, (err, todo) => {    // just pass in ID, ok to use string
    if(!todo) return console.log("Not found.");

    console.log('findById()', todo);  // found by ID, very short easy to use
}).catch((e) => console.log(e));
*/