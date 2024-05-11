import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }


  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addBlog}>
        <p>Author</p>
        <input
          data-testid='author-input'
          id="author-input"
          value={author}
          onChange={event => setAuthor(event.target.value)}
          placeholder='Whos the author?'
        />
        <input
          data-testid='title-input'
          id="title-input"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder='Title of the blog?'
        />
        <input
          data-testid='url-input'
          id="url-input"
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder='URL to blog'
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm