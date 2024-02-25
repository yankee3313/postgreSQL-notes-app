const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

router.get('/', async (req, res) => {
    const where = {}

    if (req.query.search) {
        where[Op.or] = [
            {
                title: {
                    [Op.substring]: req.query.search
                }
            },
            {
                author: {
                    [Op.substring]: req.query.search
                }
            }
        ]
    }

    const blogs = await Blog.findAll({
        order:[
            ['likes', 'DESC']
        ],
        attributes: { exclude: ['userId'] },
        include: {
        model: User,
        attributes: ['name']
        },
        where
    })
  
    console.log(JSON.stringify(blogs))
    res.json(blogs)
})
  
router.post('/', tokenExtractor, async (req, res) => {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({...req.body, userId: user.id})
        return res.json(blog)
        
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}
  
router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      console.log(req.blog.toJSON())
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
})
  
router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      console.log({ likes: req.blog.toJSON().likes })
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    if (req.blog) {
        if (req.blog.userId === req.decodedToken.id) {
            await req.blog.destroy()
            res.status(204).end()
        } else {
            res.status(403).json({error: 'You do not have permssion to delete this'})
        }
    }
})

module.exports = router