const router = require('express').Router()

const { ReadingListBlogs } = require('../models')
  
router.post('/', async (req, res) => {
    try {
        const readingListBlog = await ReadingListBlogs.create(req.body)
        res.json(readingListBlog)
    }
    catch(error) {
        return res.status(400).json({ error })
  }
})

module.exports = router