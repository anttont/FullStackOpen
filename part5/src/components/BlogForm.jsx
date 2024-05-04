import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('')  

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
        title: author,
        author: title,
        url: url
      
    })

    setNewBlog('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addBlog}>
        <input
          value={author}
          onChange={event => setAuthor(event.target.value)}
        />
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <input
          value={url}
          onChange={event => setUrl(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm