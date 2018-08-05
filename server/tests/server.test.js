process.env.PORT=3001;

const expect = require('expect');
const request = require('supertest');

var {ObjectID} = require("mongodb");
const {app} = require('./../server');   // file to be tested
const {Todo} = require('./../models/todo');

var todosSeed= [
    { 
        _id: new ObjectID(),
        text: 'Test todo 1'
    }, 
    { 
        _id: new ObjectID(),
        text: 'Test todo 2'
    }
];

beforeEach((done) => {                     // runs before every test case
    Todo.remove({}).then(()=> {            // clear database of all entries
        return Todo.insertMany(todosSeed); // add our test seed entries
    }).then(()=>done());                   // wait for insertMany() to exec then done()
});

describe('POST /todos', () => {         // test description

    // test cases
    it('should create a new todo', (done) => {

        var text='Test todo text';
        request(app)                    // send the request to test express code
        .post('/todos')                 // choose url to send request to
        .send({text})                   // post an object using supertest
        .expect(200)                    // expect 200 response (not 404 etc)
        .expect((res) => {
            expect(res.body.text).toBe(text);  // our request should returns the todo text we sent in
        })
        .end((err, res) => {
            if(err) return done(err);
            
            // check to make sure our todo was added
            Todo.find({text}).then((todos)=> {
                expect(todos.length).toBe(1);     // only 1 was added with these find parameters
                expect(todos[0].text).toBe(text); // that one should be = to the one we created
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create a todo with invalid data', (done)=> {

        request(app)
        .post('/todos')
        .send()                       // send invalid data
        .expect(400)                  // expect error because invalid data
        .end((err, res) => {
            if(err) return done(err);
            
            // check to make sure no todo was added
            Todo.find().then((todos)=> {
                expect(todos.length).toBe(2);     // 2 todo b/c no 3rd added, seed only
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2); // 2 todo (from seed data)
        })
        .end(done);
    });
});

describe('GET /todos/id', () => {

    it('should get todo by id', (done) => {

        request(app)
        .get(`/todos/${todosSeed[0]._id.toHexString()}`)           // use the id of the seed to search
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todosSeed[0].text);    // result should match the text of the seed
        })
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {

        request(app)  
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)    // make sure we get 404
        .end(done)
    });
    it('should return a 404 for non-object ID', (done) => {

        request(app)  
        .get(`/todos/123badid`)
        .expect(404)    // make sure we get 404
        .end(done)
    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a todo by id', (done) => {

        var del=todosSeed[1]._id.toHexString();
        request(app)
        .delete(`/todos/${del}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(todosSeed[1].text);
        })
        .end((err, res) => {
            if(err) return done(err);

            Todo.findById(todosSeed[1]._id).then((doc)=>{
                expect(doc).toBeFalsy();
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should return a 404 if todo not found', (done) => {

        request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done)
    });

    if('should return a 404 if object ID is invalid', (done) => {

        request(app)
        .delete(`/todos/123badID`)
        .expect(404)
        .end(done)
    });
});