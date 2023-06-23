const express = require('express')
const app = express()
var morgan = require('morgan')
let tiny = morgan('tiny')
app.use(express.json())
app.use(tiny);

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
    response.json(persons)
  })

app.get('/info',(request,response)=>{ 
   response.send(`
   <p>Phonebook has info for ${persons.length} people</p>
   <p>${new Date()}</p>                   
   `)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id);
    let person= persons.find((person)=>person.id===parseInt(id));
    if(person){
        response.json(person)
    }else{
        response.status(404).end();
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id);
    persons = persons.filter(elem=> elem.id !== id)
    response.status(204).end()
})
const generateId = () => Math.floor(Math.random()*100000)
app.post('/api/persons',(request,response)=>{
    const  body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Please make sure you have entered a name/ number' 
        })
     
      }if(persons.find(elem=>elem.name===body.name) ){
        return response.status(400).json({
             error: 'name must be unique' 
        })
      }
      let person = {
          name: body.name,
          number: body.number,
          id:generateId(),
      }
      persons = persons.concat(person)
      response.json(person)
})

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })  