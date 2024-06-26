import { createSlice } from '@reduxjs/toolkit'
import { setNotification, setTimedNotification } from './notificationReducer'
import anecdotesService from '../services/anecdotesService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setTimedNotification(`Lisätty ${content}`, 5))
  }
}

export const voteForAnecdote = id => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.vote(id)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}



export default anecdoteSlice.reducer



