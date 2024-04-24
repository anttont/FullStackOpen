const dummy = (blogs) => {

  return(1)

}

const totalLikes = (blogs) => {

  let likes = 0

  for (let i = 0; i < blogs.length; i++) {
    likes += blogs[i].likes
  }

  return(likes)
}

const getMaxLikesBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let maxLikesBlog = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > maxLikesBlog.likes) {
      maxLikesBlog = blogs[i]
    }
  }

  return maxLikesBlog
}

function getMostBlogsAuthor(blogs) {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}


  blogs.forEach(blog => {
    const author = blog.author
    authorCounts[author] = (authorCounts[author] || 0) + 1
  })

  let maxBlogs = 0
  let topAuthor = ''


  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

function getMostLikedAuthor(blogs) {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}


  blogs.forEach(blog => {
    const author = blog.author
    likesByAuthor[author] = (likesByAuthor[author] || 0) + blog.likes
  })

  let maxLikes = 0
  let topAuthor = ''


  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikes) {
      maxLikes = likesByAuthor[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  getMaxLikesBlog,
  getMostBlogsAuthor,
  getMostLikedAuthor
}

