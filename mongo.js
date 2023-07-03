const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log("give password as argument")
    process.exit()
}

const password = process.argv[2]
const url =  `mongodb+srv://xavierjeff451:${password}@cluster0.duq9smk.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set("strictQuery",false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: BigInt
})

const Phonebook = new mongoose.model("Phonebook",phonebookSchema)

if(process.argv.length == 3){
    Phonebook.find({}).then(result => {
        console.log('phonebook: \n')
        result.forEach(contact => {
                console.log(`${contact.name} ${contact.number}\n`)
        })
        mongoose.connection.close()
      })
}

const contact = new Phonebook({
    name: process.argv[3],
    number: process.argv[4]
})
if(contact.name && contact.number){
    contact.save().then(result=>{
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}
