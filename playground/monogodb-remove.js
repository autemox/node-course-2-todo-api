const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');  // our custom
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({}).then((result) => {

    console.log(result);
});