import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import anecdotesService from './services/anecdotesService'
import anecdoteReducer, { setAnecdotes} from './reducers/anecdoteReducer'

import App from './App'
import store from './reducers/store'

console.log(store.getState())

anecdotesService.getAll().then(anecdotes =>
  store.dispatch(setAnecdotes(anecdotes))
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)