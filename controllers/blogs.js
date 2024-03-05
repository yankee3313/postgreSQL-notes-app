const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const Sessions = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

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
    if(user.disabled){
        return res.status(403).json({error: 'This user is disabled'})
    } 
    const session = await Sessions.findOne({
        where: {
            userId: req.decodedToken.id,
            sessionId: req.sessionToken
        }
        })
        if (user && session){
        const currentYear = new Date().getFullYear()
        if (req.body.year < 1991 || req.body.year > currentYear) {
            return res.status(401).json({
                error: 'Year written must be between 1991 and the current year'
            })
        }
        const blog = await Blog.create({...req.body, userId: user.id})
        return res.json(blog)
    }
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
    const user = await User.findByPk(req.decodedToken.id)
    if(user.disabled){
        return res.status(403).json({error: 'This user is disabled'})
    } 
    const session = await Sessions.findOne({
        where: {
          userId: req.decodedToken.id,
          sessionId: req.sessionToken
        }
      })
    if (session) {
        if (req.blog && req.blog.userId === req.decodedToken.id){
            await req.blog.destroy()
            res.status(204).end()
        }} else {
            res.status(403).json({error: 'You do not have permssion to delete this'})
        }
    
})

module.exports = router