const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    const removeBearer = (tokenWithBearer) => {
        return tokenWithBearer.replace(/^Bearer\s/, '')}

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        req.sessionToken = removeBearer(authorization)
      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

module.exports = { tokenExtractor }