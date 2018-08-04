const {MongoClient, ObjectID} = require('mongodb');

// open connection with database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {  // client object is used to read and write data
    if(err) return console.log(err);//err out
    
    console.log('Connected to mongodb');

    // delete Many
    /*console.log("DELETE MANY");
    client.db("TodoApp").collection("Todos").deleteMany({
        text: "Walk the dog"
    }).then((result)=> {
        console.log(result); // result contains another obj result which contains n (# of documents deleted) and ok (1 meaning success)
    },(err)=> console.log(err));

    // delete One
    console.log("DELETE ONE");
    client.db("TodoApp").collection("Todos").deleteOne({
        text: "Something to do"
    }).then((result)=> {
        console.log(result.result); // result contains another obj result which contains n (# of documents deleted) and ok (1 meaning success)
    },(err)=> console.log(err));
*/
    // find One and Delete (returns document it deleted)
    console.log("FIND ONE AND DELETE");
    client.db("TodoApp").collection("Todos").findOneAndDelete({
        text: "Eat Lunch"
    }).then((doc)=> {
        console.log(doc); // returns the document it deleted
    },(err)=> console.log(err));

    // close connection with database
    client.close();
});