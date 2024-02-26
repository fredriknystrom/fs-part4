const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { oneBlog, multipleBlogs } = require('./test_helper')

const api = supertest(app)

test.only('returns all notes ', async () => {
    const n_expected_notes = 3
    const response = await api.get('/api/blogs')
    assert(response.body.length, n_expected_notes)
})

after(async () => {
  await mongoose.connection.close()
})