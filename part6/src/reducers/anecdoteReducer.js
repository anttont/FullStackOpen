import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'

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

export const { createAnecdote, voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const addAnecdote = (content) => {
  return async (dispatch) => {
    dispatch(anecdoteSlice.actions.createAnecdote(content))
    dispatch(setNotification(`Anecdote added: ${content}`))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, 5000)
  }
}

export default anecdoteSlice.reducer

