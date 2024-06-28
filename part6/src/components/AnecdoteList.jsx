import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setTimedNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter) || ''

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const vote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote.id))
    dispatch(setTimedNotification(`You voted '${anecdote.content}'`, 3))
  }

  const filteredAnecdotes = anecdotes
    .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList






