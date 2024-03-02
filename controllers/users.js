const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog, ReadingListBlogs } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
          model: Blog,
          attributes: { exclude: ['userId'] }
        }
      })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
      res.json(user)
  } catch(error) {
      res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  let readCheckValue = req.query.read

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] } ,
    include:[{
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'marked_blogs',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          model: ReadingListBlogs,
          attributes: ['id', 'readCheck'],
          where: {
            readCheck: readCheckValue
          }
        },
        include: {
          model: User,
          attributes: ['name']
        }
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    if (user) {
        user.username = req.body.username
        await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
})

module.exports = router