import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


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

const Persons = ({ persons, onDelete }) => (
  <div>
    <ul>
      {persons.map(person => (
        <li className="person" key={person.name}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  </div>
);

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const ConfirmationNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="confirmation">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [confirmationMessage, setConfirmationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.error("Error fetching persons:", error);
        setErrorMessage("Failed to fetch persons from the server.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);


  const deletePerson = (id) => {
    // Confirm before deleting
    const isConfirmed = window.confirm("Do you really want to delete this person?");
    if (isConfirmed) {
      personService
        .deleteName(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })

        .catch(error => {
          alert("An error occurred while deleting the person.");
        });

        setConfirmationMessage(
          `Person deleted`
        )
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)

    }
  };

  const addNote = (event) => {
    event.preventDefault();
    
    const nameExists = persons.some(person => person.name === newName);
    const existingPerson = persons.find(person => person.name === newName);
    if (nameExists) {
      const isConfirmed = window.confirm("Person already exists. Replace old number?");
      if (isConfirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            // Replace the person in the persons array with the updated person
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            setNewName('');
            setNewNumber('');

            setConfirmationMessage(
              `Person '${newName}' was changed`
            )
            setTimeout(() => {
              setConfirmationMessage(null)
            }, 5000)
            
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`The person '${existingPerson.name}' was already deleted from the server.`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
          
              
              setPersons(persons.filter(person => person.id !== existingPerson.id));
            } else {
              console.error(error);
              setErrorMessage("An error occurred while updating the person's number.");
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            }
          });
      }
      return;
    }
    
    const nameObject = { name: newName, number: newNumber };
    setPersons(persons.concat(nameObject));
    setNewName('');
    setNewNumber('');

    setConfirmationMessage(
      `Person '${newName}' was added`
    )
    setTimeout(() => {
      setConfirmationMessage(null)
    }, 5000)

    personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
      })
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
      <ConfirmationNotification message={confirmationMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>Add a new person</h3>

      <PersonForm 
        onSubmit={addNote}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} onDelete={deletePerson} />

    </div>
  );
};

export default App;