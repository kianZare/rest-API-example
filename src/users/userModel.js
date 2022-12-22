const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})
const User = mongoose.model('user', userSchema)
module.exports = User 

//Mongoose is an Object Document Mapping
//organization or structure for a database 
//Essentially, mongoose is a library that allows you to pass documents to a DBMS
//defining the structure of your documents and the types of data you're storing
//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and 
//defines the shape of the documents within that collection.