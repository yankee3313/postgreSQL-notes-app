const Blog = require('./blog')
const User = require('./user')
const ReadingListBlogs = require('./reading_list_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingListBlogs, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingListBlogs, as: 'users_marked' })

module.exports = {
  Blog, User, ReadingListBlogs
}