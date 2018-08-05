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
        res.status(400).send(`Err: ${e}`);
    });
});

app.get("/todos/:id", (req, res) => {   // SHOW TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Err: Invalid to-do ID"); 
    Todo.findById(req.params.id).then((todo)=> {                    
        if(!todo) res.status(404).send("Err: ID not found.");      
        res.send({todo});// returns doc that was found
    }, (e) => {                                              
        res.status(400).send(`Err: ${e}`);
    });
});

app.post("/todos", (req, res) => {      // NEW TODO
    if(req.body.text==null) return res.status(404).send("Err: No text set");
    
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

app.delete("/todos/:id", (req, res) => {  // DELETE TODO

    if(!ObjectID.isValid(req.params.id)) return res.status(404).send("Err: Not valid ID");
    Todo.findByIdAndRemove(req.params.id).then((doc) => {
        if(!doc) res.status(404).send("Err: No to-do found");

        res.status(200).send(`deleted: ${doc}`);// returns doc that was removed
    }).catch((e)=> res.status(400).send("Err: "+e));
});

// start server
app.listen(port, ()=> console.log(`Started server on port ${port}`));

module.exports={app};  // allows for testing with test/server.test.js