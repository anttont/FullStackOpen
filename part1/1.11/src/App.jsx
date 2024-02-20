import { useState } from 'react'

const Header = () => {
    return (
      <div>
        <h1>Give feedback</h1>
      </div>
    )
  }


  const Statistics = (props) => {
    if (props.neutral == 0 && props.good == 0 && props.bad == 0){
    return (
      <div></div>
      )
    }

    const All = props.bad + props.neutral + props.good
    const Average = (props.good + (props.bad * -1)) / All
    const Positive = ((props.good / All) * 100)
    
    return(
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
        <tr>
            <th>Good {props.good}</th>
            </tr>
          <tr>
            <th>Neutral {props.neutral}</th>
            </tr>
          <tr>
            <th>Bad {props.bad}</th>
          </tr>
          <tr>
            <th>All {All}</th> 
          </tr>
          <tr>
            <th>Average {Average} </th>
          </tr>
          <tr>
            <th>Positive {Positive}% </th>
          </tr>
        </tbody>
          </table>
      </div>
      )
    
  }

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    console.log("good", good)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    console.log("bad", bad)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    console.log("neutral", neutral)
  }

  return (
    <div>
      <div>
        <Header />
        
        <Button handleClick={handleGoodClick} text='good :)' />
        
        <Button handleClick={handleNeutralClick} text='neutral :|' />

        <Button handleClick={handleBadClick} text='bad :(' />
        
        
        
        <Statistics good={good} bad={bad} neutral={neutral}  />
        
      </div>
    </div>
  )
}

export default App