const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as JSON', async () => {
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)

  assert.strictEqual(Array.isArray(response.body), true, 'Response should be an array')
})

test('correct number of blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length, 'Incorrect number of blogs returned')
})

test('each blog has required fields', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.strictEqual(typeof blog.id, 'string', 'Blog should have an id field')
    assert.strictEqual(typeof blog.title, 'string', 'Blog should have a title field')
    assert.strictEqual(typeof blog.author, 'string', 'Blog should have an author field')
    assert.strictEqual(typeof blog.url, 'string', 'Blog should have a url field')
    assert.strictEqual(typeof blog.likes, 'number', 'Blog should have a likes field')
  })
})

test('a valid note can be added ', async () => {
  const newBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(contents.includes('Async'))
})

test.only('an empty likes field is fixed', async () => {
  const newBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: undefined
  }

  const correctBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const createdBlog = response.body.find(blog => blog.title === newBlog.title)

  assert.strictEqual(createdBlog.likes, correctBlog.likes, 'Empty likes field should be fixed to 0')
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]


  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'www.updatedurl.com',
    likes: 10,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.title, updatedBlogData.title, 'Title should be updated')
  assert.strictEqual(updatedBlog.author, updatedBlogData.author, 'Author should be updated')
  assert.strictEqual(updatedBlog.url, updatedBlogData.url, 'URL should be updated')
  assert.strictEqual(updatedBlog.likes, updatedBlogData.likes, 'Likes should be updated')
})


after(async () => {
  await mongoose.connection.close()
})
