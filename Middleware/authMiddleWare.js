const jwt = require('jsonwebtoken')
const User = require('../model/authModel')
require('dotenv').config()


const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Forbidden Access !!' })
    }
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Access denied ! . No token Provided' })
    }
    jwt.verify(token, process.env.JSON_SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(400).send('Unauthorized Access')
        }
        req.decoded = decoded
        next()
    })
}

module.exports = { verifyToken }