const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)  
})
  
blogsRouter.post('/', async(request, response) => {
    const blog = new Blog(request.body)
    // If likes is undefined, default it to 0
    if (blog.likes === undefined) {
      blog.likes = 0;
    }
 
    if (!blog.title || !blog.url) {
      return response.status(400).json({error: 'title or url missing'})
    }
    else {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog)
    }
})

module.exports = blogsRouter