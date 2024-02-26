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

blogsRouter.delete('/:id', async(request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)
  if (result) {
    return response.status(204).end()
  }
  else {
    response.status(404).send({ error: 'Person not found' })
  }
})

blogsRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  const body = request.body

  const blogUpdate = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blogUpdate, {new: true, runValidators: true, context: 'query'})
  if (updatedBlog) {
    return response.status(204).end()
  }
  else {
    response.status(404).send({ error: 'Person not found' })
  }
})




module.exports = blogsRouter