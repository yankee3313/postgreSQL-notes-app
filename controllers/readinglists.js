const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { tokenExtractor } = require('../util/middleware')

const { ReadingListBlogs, User } = require('../models')
  
router.post('/', async (req, res) => {
    try {
        const readingListBlog = await ReadingListBlogs.create(req.body)
        res.json(readingListBlog)
    }
    catch(error) {
        return res.status(400).json({ error })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const readingListBlog = await ReadingListBlogs.findByPk(req.params.id)
    if (readingListBlog && user.id === readingListBlog.userId) {
        readingListBlog.readCheck = req.body.readCheck
        await readingListBlog.save()
        res.json(readingListBlog)
    } else {
        res.status(403).json({error: 'You do not have permssion to modify this'})
    }
})

module.exports = router