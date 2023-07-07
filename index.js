const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
let tiny = morgan('tiny')
app.use(express.json())
app.use(tiny);
app.use(cors())
app.use(express.static('build'))
const Phonebook = require("./models/Phonebook")

function logRequestBody(req, res, next) {
  if (req.method === 'POST') {
    console.log(JSON.stringify(req.body));
  }
  next();
}

app.use(logRequestBody);

let persons  = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then((persons)=>{
    response.json(persons)
  })
  })

app.get('/info',(request,response)=>{ 
   response.send(`
   <p>Phonebook has info for ${persons.length} people</p>
   <p>${new Date()}</p>                   
   `)
})

app.get('/api/persons/:id',(request,response,next)=>{
  Phonebook.findById(request.params.id).then(person=>{
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  }).catch(err=>next(err))
})

app.delete('/api/persons/:id',(request,response, next)=>{
    Phonebook.findByIdAndRemove(request.params.id)
                           .then(()=> {
                            response.status(204).end()
                           })
                           .catch(err=>next(err))
})
const generateId = () => Math.floor(Math.random()*100000)
app.post('/api/persons',(request,response)=>{
    const  body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Please make sure you have entered a name/ number' 
        })
     
      }
      let person = new Phonebook({
          name: body.name,
          number: body.number,
      })
     person.save().then(()=>{
       response.json(person)
     })
})

app.put('/api/persons/:id',(request,response,next)=>{
  const body  = request.body;
  const person = {
    name:body.name,
    number:body.number
  }
  Phonebook.findByIdAndUpdate(request.params.id,person,{new:true})
                         .then(person=>{
                          response.json(person)})
                          .catch(err=>next(err))
                         })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })  