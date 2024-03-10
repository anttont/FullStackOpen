import React, { useState, useEffect } from 'react';
import countriesService from './services/countries';

const Filter = ({ value, onChange }) => (
  <div>
    find countries: <input value={value} onChange={onChange} />
  </div>
);

const CountryDetails = ({ country, weatherData }) => {
  const languages = Object.values(country.languages).join(', ');
  const currency = Object.values(country.currencies)[0];
  const currencyInfo = `${currency.name} (${currency.symbol})`;
  
  let tempInfo;
  let windInfo;
  let iconURL;
  let generalInfo;
  if (weatherData && weatherData.main) {
    iconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    tempInfo = `Temperature: ${Math.round(weatherData.main.temp - 273.15)}°C`;
    windInfo = `Wind  ${(weatherData.wind.speed)} m/s`;
    generalInfo = (weatherData.weather[0].main)
    
  } else {
    tempInfo = "Weather data not available";
    windInfo =""
  }

  return (
    <div>
      <h1>{country.name.official} ({country.name.common})</h1>
      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="100" />
      <p>Capital: {country.capital[0]}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Languages: {languages}</p>
      <p>Currency: {currencyInfo}</p>
      
      <div>
        <h2>Weather in {country.capital[0]}</h2>
        <p>{tempInfo}</p>
        <p>{windInfo}</p>
        <img src={iconURL} alt="Weather icon" />
        <p>{generalInfo}</p>
      </div>
      
      
    </div>
  );
};



const Country = ({ country, onClick }) => (
  <li>
    {country.name.common} 
    <button onClick={() => onClick(country)}>show more</button>
  </li>
);



const fetchWeatherForCountry = async (capital) => {
  const response = await countriesService.getWeather(capital) 
    ;
  console.log(response.data);
  await response.data;
};



const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

useEffect(() => {
  if (selectedCountry) {
    const capital = selectedCountry.capital[0]; 
    countriesService.getWeather(capital)
      .then(response => {
        setWeatherData(response.data); 
      })
      .catch(error => {
        console.error("Error fetching weather data for", capital, ":", error);
        
      });
  } else {
    setWeatherData(null); 
  }
}, [selectedCountry]); 

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


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    
    setSelectedCountry(null); 
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm)
  );

  const handleShowMore = async (country) => {
    setSelectedCountry(country);
    try {
      const weather = await fetchWeatherForCountry(country.capital[0]); 
      setWeatherData(weather); 
    } catch (error) {
      setWeatherData(null); 
      
    }
  };
  


  return (
    <div>
      <h2>Countries</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>List of Countries</h3>
      {searchTerm && (
  filteredCountries.length > 10 ? (
    <p>Too many matches, specify another filter</p>
  ) : selectedCountry ? (
    <CountryDetails country={selectedCountry} weatherData={weatherData} /> 
  ) : (
    <ul>
      {filteredCountries.map(country => (
        <Country key={country.name.common} country={country} onClick={handleShowMore} />
      ))}
    </ul>
  )
)}

    </div>
  );
};


export default App;

