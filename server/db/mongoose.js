var mongoose = require("mongoose");

mongoose.Promise = global.Promise;               // use global promises aka .then()
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/TodoApp"); // connect to db

module.exports = {mongoose};