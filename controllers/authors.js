const router = require('express').Router()
const { sequelize } = require('../util/db')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const authorInfo = await Blog.findAll({
        attributes: [
          'author',
          [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
          [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        ],
        group: 'author',
        order: [[sequelize.literal('likes'), 'DESC']],
      })
  res.json(authorInfo)
})

module.exports = router