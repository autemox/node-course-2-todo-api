const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');  // our custom
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {  // removes all to-do from database

    console.log(result);            // result.result.n = # of records removed
});

Todo.findOneAndRemove({}).then((doc) => { // removes first found

    console.log(doc);               // returns doc that was removed
});

var id='123badId';
Todo.findByIdAndRemove(id).then((doc) => {

    console.log(doc);               // returns doc that was removed
});