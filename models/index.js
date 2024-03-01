const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const ReadingListEntry = require('./readingListEntry')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(ReadingList, { through: ReadingListEntry })
ReadingList.belongsToMany(Blog, { through: ReadingListEntry })

module.exports = {
  Blog, User, ReadingList, ReadingListEntry
}