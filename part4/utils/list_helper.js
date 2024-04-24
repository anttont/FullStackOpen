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

module.exports = {
  dummy,
  totalLikes,
  getMaxLikesBlog
}

