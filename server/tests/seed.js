const {ObjectID} = require('mongodb');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId, // with auth token
        name: 'autemox',
        email: 'autemox@gmail.com',
        password: 'user1Pass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'vadne123').toString()
        }]
    },{
        _id: userTwoId, // without auth token
        name: 'colt',
        email: 'colt@gmail.com',
        password: 'user2Pass'
    }
];

var todos= [
    { 
        _id: new ObjectID(),
        text: 'Do the Dishes',
        completed: false
    }, 
    { 
        _id: new ObjectID(),
        text: 'Walk the Dog',
        completed: true, 
        completedAt: 333
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(()=> {            // clear database of all entries
        return Todo.insertMany(todos); // add our test seed entries
    }).then(()=> 
    {
        done();
    }).catch((e) => console.log("ERROR "+e));                   // wait for insertMany() to exec then done()
};

const populateUsers = (done) => {
    User.remove({}).then(()=> {       // clear database of all entries

        var userOne=new User(users[0]).save();
        var userTwo=new User(users[1]).save();
        return Promise.all([userOne, userTwo]); // multi-promise
    }).then(()=> {
        
        done();
    }).catch((e) => console.log("ERROR "+e));                   // wait for inserts to exec then done()
};

module.exports={todos, populateTodos, users, populateUsers};