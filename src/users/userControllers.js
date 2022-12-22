const User = require('./userModel') 
const jwt = require("jsonwebtoken")

//POST
//http://localhost:5001/createUsers
// {
//     "username" : "test1",
//     "email" :"test1@email.com",
//     "password" : 'password123'
// }
exports.createUser = async (req, res) => { 
    console.log(req.body)
    try {
        //add a new user to the databse from the body we pass in the request (example above)
        const newUser = await User.create(req.body)
        console.log(newUser)
        //if a user has been successfully added. send a 201 successfully created status code and send a message in the response
        res.status(201).send({message: "A user has been successfully created"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

//GET
//http://localhost:5001/readUsers
exports.readUsers = async (req, res) => {
    try {
        //call .find mongoose method with no parameters so all users will be returned and sent in the response
        const users = await User.find({})
        res.status(200).send({users: users})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

//PUT
//http://localhost:5001/updateUser
//  {
//     "usernmae" : "test1",
//     "key" : "username",
//     "value": "newTest1"
//  }
exports.updateUser = async (req, res) => {
    try {
        await User.updateOne(
            //find the user we want to update buy filtering the database by username
            {username: req.body.username},
            //use the key that we pass in the body of the request so we can dynamically update any key in our 
            //database. the value is what we want to update it too
            {[req.body.key]: req.body.value}
        )
        res.status(200).send({message: "A user felid as been updated"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}
//DELETE
//http://localhost:5001/deleteUser
// {
//     "username" : "test1"
// }
exports.deleteUser = async (req, res) => {
    try {
        //pass the username we pass in the req.body to the deleteOne method that deletes a user from our database
        await User.deleteOne({username: req.body.username})
        res.status(200).send({message: "A user successfully deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
}

//POST
//http://localhost:5001/login 
// {
//     "username" : "test1",
//     "password": "password123"
// }
exports.loginUser = async (req, res) => {
    console.log("middleware passed and controller has been called")
    try {
        //find a user in out database from the username we pass in the request.
        const user = await User.findOne({username: req.body.username})

        //generate a jwt token that encodes the users unique id we have stored the object above and the SECRET token we store as an
        //envrioment variable
        const token = await jwt.sign({_id: user._id }, process.env.SECRET)
        console.log(token)
        //send in the response the username of the user who has logged in and also send the token we generate above
        //so we can store it on the front end for future use
        res.status(200).send({username: user.username, token })
    } catch (error) {
        console.log(error)
        console.log("username not found")
        res.status(500).send({error: error.message})
    }
}
