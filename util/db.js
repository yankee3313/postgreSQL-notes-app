const { Sequelize, QueryTypes } = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
    logging: (msg) => {
      if (msg.startsWith('Executing (default): SELECT * FROM')) {
        console.log(msg);
      }
    }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.map(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
};

module.exports = { connectToDatabase, sequelize }