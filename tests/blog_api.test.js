const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { newBlog, multipleBlogs } = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('Blogs testsuite', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = multipleBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  
  describe('Getting', () => {
    test('Getting all blogs', async () => {
      const response = await api.get('/api/blogs')
      assert(response.body.length, multipleBlogs.length)
    })
    
    test('Get unique blog, identifier is named id', async () => {
      const response = await api.get('/api/blogs')
      if (response.body.length > 0) {
        const blogPost = response.body[0];
        assert(blogPost.hasOwnProperty('id'))
      } else {
        throw new Error('No blog posts found');
      }
    })
  })
  
  describe('Posting', () => {
    test('Posting a new blog', async () => {
      await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, multipleBlogs.length+1)
    })
    
    test('Post missing likes property, should default to 0', async () => {
      const newBlog = {
        title: 'Likes Default 0',
        author: 'Test author',
        url: 'default.com',
      }
    
      const response = await api.post('/api/blogs')
                                .send(newBlog)
                                .expect(201)
                                .expect('Content-Type', /application\/json/)
    
      assert.strictEqual(response.body.likes, 0)
    })
    
    test('Post with title missing, send error 400', async () => {
      const noTitleBlog = {
        author: 'Test author',
        url: 'default.com',
      }
    
      const response = await api.post('/api/blogs').send(noTitleBlog).expect(400)
      assert.strictEqual(response.body.error, 'title or url missing')
    })
    
    test('Post with url missing, send error 400', async () => {
      const noUrlBlog = {
        title: "Best title",
        author: 'Test author',
      }
    
      const response = await api.post('/api/blogs').send(noUrlBlog).expect(400)
      assert.strictEqual(response.body.error, 'title or url missing')
    })
  })
  
  describe('Delete and Update', () => {
    test('Delete note based on id', async () => {
      const deleteNode = multipleBlogs[0]
      const id = deleteNode._id.toString()
    
      await api.delete(`/api/blogs/${id}`).expect(204)
    
      const response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, multipleBlogs.length - 1)
    })
    
    test('Update blog based on id', async () => {
      const baseBlog = multipleBlogs[0]
      const id = baseBlog._id.toString()
      updateBlog = {
        ...baseBlog,
        likes: 500
      }
    
      await api.put(`/api/blogs/${id}`).send(updateBlog).expect(204)
    })
  })
  
})


after(async () => {
  await mongoose.connection.close()
})