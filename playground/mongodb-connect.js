const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// object destructing
// lets you pull out properties from an object creating variables
var user = { 
    name: "Colt",
    age: 25,
    location: "Ohio"
}
var {name} = user;  // destructures: create a variable called name set to user.name
console.log(name);

// open connection with database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {  // client object is used to read and write data
    if(err) return console.log(err);//err out
    
    console.log('Connected to mongodb');

    /*
    client.db('TodoApp').collection('Todos').insertOne({ // object to insert
        text: 'Something to do',
        completed: false 
    }, (err, result) => { // callback
       if(err) return console.log(err);
       
       console.log(JSON.stringify(result.ops, undefined, 2));
    });
    */

    // insert new doc into database TodoApp, table Users, columns name, age, location
    client.db("TodoApp").collection("Users").insertOne({
        name: "Colt",
        age: 25,
        location: "Ohio"
    }, (err, result) => {
        if(err) return console.log(err);//err out

        console.log("inserted "+result.ops+" at "+  result.ops[0]._id.getTimestamp());
    })

    // close connection with database
    client.close();
});