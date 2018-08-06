var mongoose = require("mongoose");

mongoose.Promise = global.Promise;               // use global promises aka .then()
mongoose.connect(process.env.MONGODB_URI); // connect to db

module.exports = {mongoose};