const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { oneBlog, multipleBlogs } = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

test.only('returns all notes', async () => {
    const n_expected_notes = 3
    const response = await api.get('/api/blogs')
    assert(response.body.length, n_expected_notes)
})

test.only('blog post unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  if (response.body.length > 0) {
    const blogPost = response.body[0];
    assert(blogPost.hasOwnProperty('id'))
  } else {
    throw new Error('No blog posts found');
  }
})  

after(async () => {
  await mongoose.connection.close()
})