const jwt = require('jsonwebtoken')
const User = require('../model/authModel')


const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Access denied ! . No token Provided' })
    }
}