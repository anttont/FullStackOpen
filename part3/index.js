require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
const Person = require('./models/person')

const mongoose = require('mongoose')
const password = "a1k4SvHsmKTpm6Fy"


// Define a custom token for Morgan to log request body
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});


// Use Morgan to log the request and include the custom token for the response body
app.use(morgan(':method :url :status :response-time ms - response-body: :response-body'));

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);
app.use((req, res, next) => {
  const oldSend = res.send;

  res.send = function (data) {
    req.responseBody = data; 
    oldSend.apply(res, arguments);
  };

  next();
});


morgan.token('response-body', (req, res) => {
  
  return req.responseBody;
});

let persons = [
  
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    
    response.json(persons)
  })
});



app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end(); // No person found with the given ID
      }
    })
    .catch(error => next(error)); // Pass any errors to the error handling middleware
});


app.get('/api/info', (request, response) => {
  const currentTime = new Date().toLocaleString();
  const amountOfPeople = persons.length;
  response.send(
    `<div><h2>Amount of people: ${amountOfPeople}</h2>` +
      `<h2>Current Time: ${currentTime}</h2><div/>`
  );
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  // Check if name or number is missing from the request body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  // Create a new person instance using the model
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // Save the person instance to the database
  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error)); // Pass errors to the error handling middleware
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(unknownEndpoint);



