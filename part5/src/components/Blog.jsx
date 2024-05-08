import React, { useState, useEffect } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, authToken, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  useEffect(() => {
    blogService.setToken(authToken);
  }, [authToken]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    try {
      const updatedBlog = { ...blog, likes: likes + 1 };
      await blogService.update(blog.id, updatedBlog);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id, authToken);
      onDelete(id); // Notify parent component about successful deletion
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const blogStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <strong>{blog.title}</strong>
        <button onClick={toggleDetails} style={buttonStyle}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>Likes: {likes}</p>
          <button onClick={handleLike} style={buttonStyle}>
            Like
          </button>
          <button onClick={() => handleDelete(blog.id)} style={buttonStyle}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;



