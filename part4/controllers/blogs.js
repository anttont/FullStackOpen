const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response,) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.get('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})



blogsRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlogDocument = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })

    if (updatedBlogDocument) {
      response.json(updatedBlogDocument)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.post('/', async (request, response) => {

  const body = request.body

  if (body.likes === undefined || body.likes === null || body.likes === '') {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })



  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter