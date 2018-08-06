const bcrypt=require('bcryptjs');

// create hashed password
var password = 'mypassword';
bcrypt.genSalt(10, (err, salt) => {  // bigger number = takes longer on purpose to prevent brute force
    
    bcrypt.hash(password, salt, (err, hash) => {

        console.log(hash);   // store hash in your db instead of password.  has built in salt to prevent hash mining
    });
}); 

// compare hashed value
var hashedPassword = '23orij2ofhjweklgjhklgasdgasd';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);  // true or false, does pass = hash?
});



/*
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = { id: 10 }                          // data to be validated
var token = jwt.sign(data, 'oursecret');       // token is sent to user and data is validated.  user cannot fake validation b/c doesn't have secret.
var decoded = jwt.verify(token, 'oursecret');  // verify token from user contains validated data
console.log('decoded', decoded);          
*/