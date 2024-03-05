const router = require('express').Router()

const Sessions = require('../models/session')

const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
    try {
        await Sessions.destroy({ where: { 
            userId: req.decodedToken.id } })
            res.status(200).json({ message: 'User successfully logged out' })
    } 
    catch (error) {
        res.status(500).json({ error: 'Error logging out' })
    }
})

module.exports = router