import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')  
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      console.log(exception)
      setTimeout(() => {
        //setErrorMessage(null)
      }, 5000)
    }
  }

  const handleAddBlog = async (event) => {
    event.preventDefault();
  
    try {
      const newBlog = {
        title,
        author,
        url,
      };
      const createdBlog = await blogService.create(newBlog);
  
      setBlogs([...blogs, createdBlog]);
  
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      console.error('Failed to add blog:', error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (

    <><div>
      <h1>
        Add a blog
      </h1>

      <form onSubmit={handleAddBlog}>
      <div>
        title 
          <input
          type="text"
          value={title}
          name="Username"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author 
          <input
          type="text"
          value={author}
          name="Password"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>

      <div>
        url 
          <input
          type="text"
          value={url}
          name="Password"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button type="submit">Add</button>
    </form>   

    </div>
    <div>
        <h2>blogs</h2>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} />
        )}

      </div></>
  )

  return (
    <div>     

      <h2>Login</h2>

      {!user && loginForm()} 
      {user && <div>
       <p>{user.name} logged in</p> 
       <button onClick={handleLogout}>logout</button>
         {blogForm()}
      </div>
      } 
    </div>
  )
}

export default App