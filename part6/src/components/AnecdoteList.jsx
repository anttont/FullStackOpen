import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote, initializeAnecdotes  } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter) || ''

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const vote = (id) => {
    dispatch(voteForAnecdote(id))
    dispatch(setNotification('Anecdote voted'))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, 5000)
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filteredAnecdotes.slice()
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList





