const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../users/userModel')


exports.hashPass = async (req, res, next) => {
    try {
        // let plainTextPassword = req.body.password
        //hash plain text password using .hash bcrypt method
        req.body.password = await bcrypt.hash(req.body.password, 10)
        //middleware has to be told to move on to the controller so we call next as a function 
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error.message})
    }
}

exports.comparePass = async (req, res, next) => {
    try {
        //find and store user credentials from our database in a new object in the request
        req.user = await User.findOne({username: req.body.username})

        // we now have access to the hashed password in the database so we can compare it with the plain text password 
        //sent in the request
        console.log("PLAIN TEXT PASSWORD")
        console.log(req.body.password)
        console.log("HASHED PASSWORD")
        console.log(req.user.password)

        // if req.user is not null and .compare returns true (meaning the plaintext password and the hashed password match)
        //call next and move onto the controller

        //else user doesn't exist or the passwords don't match so throw a new error
        if(req.user && await bcrypt.compare(req.body.password, req.user.password)) {
            console.log("username exists and plain text password matches hashed password")
            next()
        } else {
            throw new Error ("incorrect username or password")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error.message})
    }
}


exports.tokenCheck = async (req, res, next) => {
    try {
        //get the token thats passed in the headers 
        const token = req.header("Authorization").replace("Bearer ", "")
        // console.log("token from headers of the request")
        // console.log(token)

        // decode the token using the jwt verify method. we pass the method two parameters.
        //encoded token that we got on line  49 and the secret password we encoded in the token when we generated it 
        const decodedToken = await jwt.verify(token, process.env.SECRET)
        // console.log("decoded token")
        // console.log(decodedToken._id)
        
        //decodedToken is an objecting containing the users unique id. 
        //we can then use that unique id to find our user in our database =
        const user = await User.findById(decodedToken._id)
        // console.log("find by ID")
        // console.log(user)

        //if user is not null. move onto the controller
        //else throw a new error that user is not authorised or doesn't exist in our database
        if(user) {
            next()
        } else {
            throw new Error ("user is not authorised")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error.message})
    }
}



