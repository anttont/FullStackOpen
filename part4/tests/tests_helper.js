const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'TESTI TESTI',
    author: 'Testi author',
    url: 'www.testi.fi',
    likes: 2323,

  },
  {
    title: 'Juu testi',
    author: 'Teesti',
    url: 'www.juu.fi',
    likes: 323,

  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}