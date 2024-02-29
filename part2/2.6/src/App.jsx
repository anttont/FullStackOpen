import { useState } from 'react';

const PersonForm = ({ onSubmit, newName, newNumber, handleNameChange, handleNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Filter = ({ value, onChange }) => (
  <div>
    search: <input value={value} onChange={onChange} />
  </div>
);


const Person = ({ person }) => <li>{person.name} {person.number}</li>;

const Persons = ({ persons }) => (
  <ul>
    {persons.map(person => <Person key={person.name} person={person} />)}
  </ul>
);


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const addNote = (event) => {
    event.preventDefault();
    const nameExists = persons.some(person => person.name === newName);
    if (nameExists) {
      alert(`${newName} is already added to the phonebook.`);
      return;
    }
    const nameObject = { name: newName, number: newNumber };
    setPersons(persons.concat(nameObject));
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  const filteredPersons = searchTerm
    ? persons.filter(person => person.name.toLowerCase().includes(searchTerm))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm 
        onSubmit={addNote}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;