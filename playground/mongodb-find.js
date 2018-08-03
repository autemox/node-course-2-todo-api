const {MongoClient, ObjectID} = require('mongodb');

// open connection with database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {  // client object is used to read and write data
    if(err) return console.log(err);//err out
    
    console.log('Connected to mongodb');

    // query all documents in a collection
    client.db("TodoApp").collection('Todos').find().toArray().then((docs) => {   // if we get back an array of documents in collection Todos
        
        console.log('All Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => console.log(err));

    // query documents based on criteria
    client.db("TodoApp").collection('Todos').find({  // object that contains key/value pairs we are looking for
        completed: false
    }).toArray().then((docs) => {   // if we get back an array of documents in collection Todos
        
        console.log('Uncompleted Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => console.log(err));

    // query document based on object id
    client.db("TodoApp").collection('Todos').find({ 
        _id: new ObjectID('5b6482c9df039030787b06d9')   // creates ObjectID object from ID string to search for it
    }).toArray().then((docs) => {   // if we get back an array of documents in collection Todos
        
        console.log('Todos that match ID 5b6482c9df039030787b06d9');
        console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => console.log(err));

    // query document to count documents in collection Todos
    client.db("TodoApp").collection('Todos').find().count().then((count) => {   // if we get back an array of documents in collection Todos
        
        console.log(`Amount of Todos Total: ${count}`);   // displays total # of documents in collections
    }, (err) => console.log(err));;

    // query users for jen
    client.db("TodoApp").collection("Users").find({
        name: "Jen"
    }).toArray().then((docs) => {
            console.log("Todo Matching 'Jen':");
            console.log(JSON.stringify(docs, undefined, 2));
        }, 
        (err) => console.log(err));

    // close connection with database
    client.close();
});