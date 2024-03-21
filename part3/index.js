require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')



// Define a custom token for Morgan to log request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})


// Use Morgan to log the request and include the custom token for the response body
app.use(morgan(':method :url :status :response-time ms - response-body: :response-body'))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use((req, res, next) => {
  const oldSend = res.send

  res.send = function (data) {
    req.responseBody = data
    oldSend.apply(res, arguments)
  }

  next()
})



morgan.token('response-body', (req) => {

  return req.responseBody
})


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {

    response.json(persons)
  })
})



app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/api/info', (request, response) => {
  Person.countDocuments({})
    .then(amountOfPeople => {
      const currentTime = new Date().toLocaleString()
      response.send(
        `<div><h2>Amount of people: ${amountOfPeople}</h2>` +
      `<h2>Current Time: ${currentTime}</h2><div/>`
      )
    })
    .catch(error => {
      console.error('Error fetching count from database:', error)
      response.status(500).send('Error fetching information from the server')
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body


  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }


  const person = new Person({
    name: body.name,
    number: body.number,
  })


  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const person = {
    name: req.body.name,
    number: req.body.number,

  }


  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)



