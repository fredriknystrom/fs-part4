const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
  }

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    return blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max
    }, blogs[0])
  };
  
  module.exports = {
    totalLikes,
    favoriteBlog
  }