import React, { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import userService from '../services/users'

const Blog = ({ blog, authToken, onDelete, user, mockHandler }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [isCreator, setIsCreator] = useState(false)


  useEffect(() => {
    blogService.setToken(authToken)
    if (user) {
      const fetchUserID = async () => {
        try {
          const userID = await getUserID(user)
          if (userID && blog.user && userID === blog.user.id) {
            setIsCreator(true)
          } else {
            setIsCreator(false)
          }
        } catch (error) {
          console.error('Error fetching user ID:', error)
          setIsCreator(false)
        }
      }
      fetchUserID()
    } else {
      setIsCreator(false)
    }
  }, [authToken, blog, user])



  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    mockHandler() // for testing
    try {
      const updatedBlog = { ...blog, likes: likes + 1 }
      await blogService.update(blog.id, updatedBlog)
      setLikes(likes + 1)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id, authToken)
      onDelete(id)
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const getUserID = async (user) => {
    try {

      const users = await userService.getAll()


      const foundUser = users.find(u => u.username === user)


      if (foundUser) {

        return foundUser.id
      } else {

        console.log(`User '${user.username}' not found`)
        return null
      }
    } catch (error) {
      console.error(error)

      throw error
    }
  }

  const blogStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  }

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <strong>{blog.title}</strong>
        <button onClick={toggleDetails} style={buttonStyle} data-testid="showdetails">
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>Likes: {likes}</p>
          <button onClick={handleLike} style={buttonStyle} data-testid="likes">
            Like
          </button>
          {isCreator && (
            <button onClick={() => handleDelete(blog.id)} style={buttonStyle} data-testid="delete">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog




