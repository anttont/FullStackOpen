import React from 'react'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => (
  <div>
    <h2>Anecdotes</h2>
    <Notification />
    <Filter />
    <AnecdoteForm />
    <AnecdoteList />
  </div>
)

export default App


