const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 4}
    ]
  }

  

  const Course = (props) => {
    const fieldName = "name"
    const list = props.course.parts
   
    const totalExercises = list.reduce((sum, course) => sum + course.exercises, 0);

    return (
      <div>
        <h1>
          {props.course[fieldName]}
        </h1>
        

        <ul>
        {list.map(course => 
          <li key={course.id}>
            {course.name} {course.exercises}
          </li>       
        )}
      </ul>   
      <p>Total of {totalExercises} exercises</p>

      </div>
    )
  }

  return (
    <div>
      <Course course={course} />
      
    </div>
  )
}

export default App