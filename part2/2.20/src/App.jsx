import React, { useState, useEffect } from 'react';
import countriesService from './services/countries';

const Filter = ({ value, onChange }) => (
  <div>
    find countries: <input value={value} onChange={onChange} />
  </div>
);

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages).join(', ');
  const currency = Object.values(country.currencies)[0];
  const currencyInfo = `${currency.name} (${currency.symbol})`;

  return (
    <div>
      <h1>{country.name.official} ({country.name.common})</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Languages: {languages}</p>
      <p>Currency: {currencyInfo}</p>
      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="100" />
    </div>
  );
};


const Country = ({ country }) => <li>{country.name.common}</li>;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [oneCountry, setOneCountry] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    countriesService
      .getAll()
      .then(response => {
        setCountries(response.data);
      })
      
      .catch(error => {
        console.error("Error fetching countries:", error);
        setErrorMessage("Failed to fetch countries from the server.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2>Countries</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>List of Countries</h3>
      {searchTerm && (
        filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length === 1 ? (
          <CountryDetails country={filteredCountries[0]} />
        ) : (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.name.common}>{country.name.common} <button >show more</button> </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default App;

