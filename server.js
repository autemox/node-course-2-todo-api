var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();

app.use(bodyParser.json());

// routes
app.get("/", (req, res) => {
    res.send("Home");
});
app.post("/todos", (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.send(e);
    });
});

// start server
app.listen(3000, ()=> console.log("Started server on port 3000")); // Unhandled 'error' event