import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import { Notification, ErrorNotification } from './components/Notification';


const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

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
      setMessage("Login successfull")
      setTimeout(() => {
        setMessage(
          null
        )
      }, 5000)
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      console.log(exception)
      setTimeout(() => {
        setErrorMessage(
          null
        )
      }, 5000)
    }
  }

  const handleNoteChange = (event) => {
    setBlogs(event.target.value)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
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
      setMessage("Blog added")
      setTimeout(() => {
        setMessage(
          null
        )
      }, 5000)
    } catch (error) {
      console.error('Failed to add blog:', error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  return (
    <div>     

      <ErrorNotification message={errorMessage} />
      <Notification message={message} />

      {!user && loginForm()}
      {user && <div>
       <p>{user.name} logged in</p>
       <button onClick={handleLogout}>logout</button>
       <Togglable buttonLabel="new blog" ref={blogFormRef}>
       
       <BlogForm createBlog={addBlog} />
        
      </Togglable>

      <h2>Blogs</h2>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} />
        )}
      </div>
     } 


      
    </div>
  )
}

export default App