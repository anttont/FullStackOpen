import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const searchURL = "https://studies.cs.helsinki.fi/restcountries/api/name/"

const getAll = () => {
  return axios.get(baseUrl)
}

const getCountry = (country) => {
  return axios.get(searchURL+country)
}


  

export default { getAll};