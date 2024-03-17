const express = require('express');
const morgan = require('morgan');
const cors = require('cors')


const app = express();

// Define a custom token for Morgan to log request body
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

// Define a custom token for Morgan to log request parameters
morgan.token('params', (req, res) => {
  return JSON.stringify(req.params);
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
  {
    name: 'Arto Helas',
    number: '050',
    id: '1',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: 'person is already present',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(unknownEndpoint);



