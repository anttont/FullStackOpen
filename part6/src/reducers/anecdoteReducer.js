import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import anecdotesService from '../services/anecdotesService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(n => n.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1
      }
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
    const notes = await anecdotesService.getAll()
    dispatch(setAnecdotes(notes))
  }
}

export const addAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setNotification(`Anecdote added: ${content}`))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, 5000)
  }
}

export default anecdoteSlice.reducer


