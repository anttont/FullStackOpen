import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const searchURL = "https://studies.cs.helsinki.fi/restcountries/api/"


const apiKey = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  return axios.get(baseUrl)
}

const getWeather = (city) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
}


  

export default {getAll, getWeather};