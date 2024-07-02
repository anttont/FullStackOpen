import React from 'react'

const AnecdoteForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
