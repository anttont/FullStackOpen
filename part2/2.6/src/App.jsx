import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const Person = ({ persons }) => {
    return (
      <li>{persons.name}</li>
    )
  }

  const addNote = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName
      }
  
    setPersons(persons.concat(nameObject))
    setNewName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form 
      onSubmit={addNote}>
      <div>
          name: <input value={newName}
                onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(persons => 
          <Person key={persons.name} persons={persons} />
        )}
      </ul>
    </div>
  )

}

export default App