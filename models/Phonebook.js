const mongoose  = require("mongoose")
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url).then((result)=>{
    console.log('Connected successfully to MongoDb!')
})
.catch((error)=>{
 console.log(`Error occurred when connecting to MongoDb ${error.message}`)
})
const phoneBookSchema = mongoose.Schema({
    name:{
        type:String,
        minLength: 3,
        required:true
    },
    number:String
})

phoneBookSchema.set("toJSON",{transform: (document,returnedObj)=>{
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
}})

module.exports = mongoose.model("Phonebook",phoneBookSchema)