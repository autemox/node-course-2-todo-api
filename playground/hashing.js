const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = { id: 10 }                          // data to be validated
var token = jwt.sign(data, 'oursecret');       // token is sent to user and data is validated.  user cannot fake validation b/c doesn't have secret.
var decoded = jwt.verify(token, 'oursecret');  // verify token from user contains validated data
console.log('decoded', decoded);          