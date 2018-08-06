process.env.PORT=3001;

const expect = require('expect');
const request = require('supertest');

var {ObjectID} = require("mongodb");
const {app} = require('./../server');   // file to be tested
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require("./seed");

beforeEach(populateTodos);
beforeEach(populateUsers);

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
        .get(`/todos/${todos[0]._id.toHexString()}`)           // use the id of the seed to search
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);    // result should match the text of the seed
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

        var del=todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${del}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(todos[1].text);
        })
        .end((err, res) => {
            if(err) return done(err);

            Todo.findById(todos[1]._id).then((doc)=>{
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

    describe('PATCH /todo/:id', () => {

        it('should update the todo', (done) => {
            
            var id=todos[0]._id.toHexString(); // grab id of first item
            var text ='New text';

            request(app)
            .patch(`/todos/${id}`)
            .send({ 
                completed: true,
                text
            }) // update text, set completed true
            .expect(200) // 200
            .expect((res) => {
                
                expect(res.body.todo.text).toBe(text);   //text is changed
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
        });

        it('should clear completedAt when todo is not completed', (done) => {
            
            var id=todos[1]._id.toHexString(); // grab id of second todo
            var txt="text for new second todo";

            request(app) 
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text: txt
            })
            .expect(200) // update text, set completed to false
            .expect((res)=> {

                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
                expect(res.body.todo.text).toBe(txt); 
            })
            .end(done);
        });
    });

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {

            request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
        });

        it('should rturn a 401 if not auth', (done) => {

            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create a user', (done) => {
            var name='example';
            var email='example@example.com';
            var password='123mnb!';

            request(app)
            .post('/users')
            .send({name, email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) return done(err);

                User.findOne({email}).then((user) => {

                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e)=> done(e));
            });
        });

        it('should return validation errors if request invalid', (done) => {

            request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end(done);
        });

        it('should not create user if email in use', (done) => {

            var name="MyName";
            var email=users[0].email;
            var password='123mnb!';

            request(app)
            .post('/users')
            .send({name, email, password})
            .expect(400)
            .end(done);
        });
    });

    describe('POST /users/login (test login)', () => {

        it('should login user: return 200 and token if successful login', (done) => {

            var email=users[0].email;
            var password=users[0].password;

            request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[0]._id).then((user)=> {

                    expect(user.toObject().tokens[1]).toMatchObject({

                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=> done(e));
            });
        });

        it('should reject invalid login: return 400', (done) => {

            request(app)
            .post('/users/login')
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) return done(err);

                User.findById(users[0]._id).then((user)=> {

                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e)=> done(e));
            });
        });
    });
});