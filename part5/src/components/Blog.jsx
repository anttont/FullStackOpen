import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
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
        <strong>{blog.title}</strong> {blog.author}
        <button onClick={toggleDetails} style={buttonStyle}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes}</p>
          
        </div>
      )}
    </div>
  );
};

export default Blog;
