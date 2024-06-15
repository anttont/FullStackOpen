
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const initialState = {
  anecdotes: anecdotesAtStart.map(asObject),
  filter: ''
}

const SET_FILTER = 'SET_FILTER'

export const setFilter = (filter) => {
  return {
    type: SET_FILTER,
    payload: { filter }
  }
}



const VOTE = 'VOTE'

export const voteAnecdote = (id) => {
  return {
    type: VOTE,
    payload: { id }
  }
}

export const createAnecdote = (content) => {
  console.log(content)
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      votes: 0,
      id: getId()
    }
  }
}

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return {
        ...state,
        anecdotes: [...state.anecdotes, action.payload]
      }
    case VOTE:
      const id = action.payload.id
      const anecdoteToVote = state.anecdotes.find(a => a.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return {
        ...state,
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id !== id ? anecdote : votedAnecdote
        )
      }
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      }
    default:
      return state
  }
}

export default anecdoteReducer
