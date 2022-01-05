const logger = require('./logger')
const config = require('./config.js')
const jwt = require('jsonwebtoken')

const  verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']
    if (!token) {
        return res.sendStatus(403)
    }
    jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'token error, try to relog' })
        }
        req.username = decoded.username
        req.role = decoded.role
        next()
    })
}

const authJwt = {
    verifyToken: verifyToken
}

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

module.exports = {
    requestLogger, errorHandler, authJwt
}