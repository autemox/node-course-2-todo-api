var express = require("express");
var bodyParser = require("body-parser");

var {ObjectID} = require("mongodb");
var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// routes
app.get("/", (req, res) => {            // SHOW HOME
    res.send("<a href=/todos>To-do list</a>");
});

app.get("/todos", (req, res) => {       // LIST TODOS

    Todo.find().then((todos)=> { // find() success: send todos json
        res.send({todos}); 
    }, (e) => {                  // find() fail: err out
        res.status(400).send(e);
    });
});

app.get("/todos/:id", (req, res) => {   // SHOW TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Invalid to-do ID");   // check if ID was the right length/syntax
    Todo.findById(req.params.id).then((todo)=> {                                // find() ran succesfully
        if(!todo) res.status(404).send("ID not found.");                        // no data found
        res.send({todo});                                                       // data found
    }, (e) => {                                                                 // find() fail: err out
        res.status(400).send(e);
    });
});

app.post("/todos", (req, res) => {      // NEW TODO
    // display the object received
    console.log(req.body);
    
    // create the todo mongoose object
    var todo = new Todo({
        text: req.body.text
    });

    // save the todo mongoose object
    todo.save().then((doc) => {    // save() success: send todo json
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);   // save() fail: err out
      });
});

// start server
app.listen(port, ()=> console.log(`Started server on port ${port}`));

module.exports={app};  // allows for testing with test/server.test.js