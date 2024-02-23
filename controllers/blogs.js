const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
  
    console.log(JSON.stringify(blogs))
    res.json(blogs)
})
  
router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.json(blog)
    } catch(error) {
        return res.status(400).json({ error })
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

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      await req.blog.destroy()
    }
    res.status(204).end()
  })

module.exports = router