const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })


  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'antto',
      name: 'anton',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
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


test('a valid blog can be added ', async () => {

  const newUser = {
    username: 'tester',
    name: 'test',
    password: 'salainen',
  }

  const savedUser = await api.post('/api/users').send(newUser)

  const userForToken = {
    username: savedUser.body.username,
    id: savedUser.body.id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  const newBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,
    user: savedUser.body.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(contents.includes('Async'))
})

test('a blog without authentication is not added ', async () => {
  const newUser = {
    username: 'testernotoken',
    name: 'testnotoken',
    password: 'salainen',
  }

  const savedUser = await api.post('/api/users').send(newUser)

  const newBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,
    user: savedUser.body.id
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401) // Expecting 401 for unauthorized access
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.status, 200) // Ensure the status code is 200

  assert(!contents.includes('Async')) // Ensure the blog was not added
})


test.only('an empty likes field is fixed', async () => {

  const newUser = {
    username: 'testerempty',
    name: 'empty',
    password: 'salainen',
  }

  const savedUser = await api.post('/api/users').send(newUser)

  const userForToken = {
    username: savedUser.body.username,
    id: savedUser.body.id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  const newBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: undefined,
    user: savedUser.body.id
  }

  const correctBlog = {
    title: 'Async',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 0,
    user: savedUser.body.id
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const createdBlog = response.body.find(blog => blog.title === newBlog.title)

  assert.strictEqual(createdBlog.likes, correctBlog.likes, 'Empty likes field should be fixed to 0')
})

test('a blog can be deleted by the user who created it', async () => {

  const newUser = {
    username: 'deletetester',
    name: 'delete',
    password: 'salainen',
  }

  const savedUser = await api.post('/api/users').send(newUser)

  const userForToken = {
    username: savedUser.body.username,
    id: savedUser.body.id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  const newBlog = {
    title: 'delete',
    author: 'delete',
    url: 'www.Async.fi',
    likes: 1,
    user: savedUser.body.id
  }

  const savedBlogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  const savedBlog = savedBlogResponse.body

  await api
    .delete(`/api/blogs/${savedBlog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const remainingBlog = blogsAtEnd.find(blog => blog.id === savedBlog.id)
  assert.strictEqual(remainingBlog, undefined, 'Blog should be deleted by the user who created it')
})



test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'www.updatedurl.com',
    likes: 10
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
