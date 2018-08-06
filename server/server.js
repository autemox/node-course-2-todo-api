var config = require('./config/config');    // configuration and environmental variables

var express = require("express");           // third party packages
var bodyParser = require("body-parser");
var _ = require("lodash");

var {ObjectID} = require("mongodb");
var {mongoose} = require("./db/mongoose");  // connects to our mongoose database

var {Todo} = require("./models/todo");      // schema and models for collections
var {User} = require("./models/user");
var {authenticate} = require('./middleware/authenticate');

port=process.env.PORT;                      // initialize variables
var app = express();

app.use(bodyParser.json());                 // initialize express

// --------------
// todos routes
// --------------

app.get("/", (req, res) => {            // SHOW HOME
    res.send("<a href=/todos>To-do list</a>");
});

app.get("/todos", (req, res) => {       // LIST TODOS

    Todo.find().then((todos)=> { // find() success: send todos json
        res.send({todos}); 
    }, (e) => {                  // find() fail: err out
        res.status(400).send(`Err: ${e}`);
    });
});

app.get("/todos/:id", (req, res) => {   // SHOW TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Err: Invalid to-do ID"); 
    Todo.findById(req.params.id).then((todo)=> {                    
        if(!todo) res.status(404).send("Err: ID not found.");      
        else res.send({todo});// returns doc that was found
    }).catch((e)=> res.status(400).send(`Err: ${e}`));
});

app.post("/todos", (req, res) => {      // NEW TODO
    
    // create the todo mongoose object
    var todo = new Todo({
        text: req.body.text
    });

    // save the todo mongoose object
    todo.save().then((doc) => {    // save() success: send todo json
        res.send(doc);
    }).catch((e) => res.status(400).send(e));
});

app.delete("/todos/:id", (req, res) => {  // DELETE TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Err: Not valid ID");
    
    Todo.findByIdAndRemove(req.params.id).then((doc) => {
        if(!doc) return res.status(404).send("Err: No to-do found");
       
        res.status(200).send(doc);        // returns doc that was removed
    }).catch((e)=> res.status(400).send("Err: "+e));
});

app.patch("/todos/:id", (req, res) => {   // UPDATE TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Err: Not valid ID");

    // prune our object
    var body = _.pick(req.body, ['text', 'completed']);  // create object from object but only imports variables specified in arr 
    if(_.isBoolean(body.completed) && body.completed) {  // check if completed
        body.completedAt=new Date().getTime();           // get javascript timestamp in ms and set completed date
    } else {                                             // check if not completed
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((todo) => {  // perform the update
        if(!todo) return status(404).send();

        res.send({todo});                                                   // returns doc that was updated
    }).catch((e)=> res.status(400).send());
});

// --------------
// users routes
// --------------

app.post("/users", (req, res) => {

    var body=_.pick(req.body, ['email', 'name', 'password']);
    var user = new User(body);

    user.save().then(() => {

        return user.generateAuthToken();

    }).then((token) => {
        
        res.header('x-auth', token).status(200).send(user);  // x-<name> will be a custom header because of the x-

    }).catch((e)=> res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);        
});

app.post("/users/login", (req, res) => {

    var body=_.pick(req.body, ['email', 'name', 'password']);

    User.findByCredentials(req.body.email, req.body.password).then((user) => {

        // create a token
        return user.generateAuthToken().then((token) => {

            res.header('x-auth', token).status(200).send(user);  
        }).catch((e)=> console.log(e));
    }).catch((e)=> res.status(400).send());
});





// start server
app.listen(port, ()=> console.log(`Started server on port ${port}`));

module.exports={app};  // allows for testing with test/server.test.js