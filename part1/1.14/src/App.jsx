import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0});

  const [selected, setSelected] = useState(0)
  const [selectedMostVotes, setSelectedMostVotes] = useState(null)

  const handleNextClick = () => {
    setSelected(getRandomInt(anecdotes.length))
    console.log(selected)
  }

  const handleVoteClick = () => {
    setVotes(votes => ({
      ...votes,
      [selected]: votes[selected] + 1
    }));
    setSelectedMostVotes(mostVoted({...votes, [selected]: votes[selected] + 1})); // Update the most voted anecdote
  };
  

  const mostVoted = (votes) => {
    let maxValue = 0;
    let maxKey = -1; // Initialize with -1 instead of an empty string
    for (const [key, value] of Object.entries(votes)) {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }
    return maxKey !== -1 ? parseInt(maxKey) : null; // Return null if no votes
  };
  

  return (
    <div>
      <div>
        <h1>Anectode of the day</h1>
        <p>{anecdotes[selected]}</p>
        <Button handleClick={handleNextClick} text="Next" />
        <Button handleClick={handleVoteClick} text="Vote" />
        
        <h1>Most voted anecdote</h1>
        {selectedMostVotes !== null ? <p>{anecdotes[selectedMostVotes]}</p> : <p>No anecdote has been voted yet</p>}
        </div> 
    </div>
  )
}

export default App
