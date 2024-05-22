import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <div>
        <h2>create new</h2>
    <form onSubmit={addAnecdote}>
        <input name="note" />
        <button type="submit">add</button>
        </form>
    </div>
    
    )
}

export default AnecdoteForm