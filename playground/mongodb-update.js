const {MongoClient, ObjectID} = require('mongodb');

// open connection with database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {  // client object is used to read and write data
    if(err) return console.log(err);//err out
    
    // find user Autemox, change his name and update age by 1
    client.db("TodoApp").collections("Users").findOneAndUpdate({
        name: "Autemox" // find by var
    },{
        $set:{          // set a var
            name: "Lss", 
        }, 
        $inc: {        // increment a var
            age: 1
        }
    }).then((result) => {
        console.log(JSON.stringify(result)); // result
    }).then((err) => console.log(err));

    // close connection with database
    client.close();
});