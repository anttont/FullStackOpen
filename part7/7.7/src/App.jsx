import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) {
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        if (response.data) {
          setCountry({
            found: true,
            data: response.data
          })
        } else {
          setCountry({ found: false })
        }
        setError(null)
      } catch (error) {
        setCountry({ found: false })
        setError(error.message)
      }
    }

    fetchCountry()
  }, [name])

  return { country, error }
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  const { name, capital, population, flags } = country.data
  const capitalName = Array.isArray(capital) ? capital[0] : capital

  return (
    <div>
      <h3>{name.common}</h3>
      <div>capital {capitalName}</div>
      <div>population {population}</div>
      <img src={flags.png} height='100' alt={`flag of ${name.common}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const { country, error } = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      {error ? <div>Error: {error}</div> : <Country country={country} />}
    </div>
  )
}

export default App

