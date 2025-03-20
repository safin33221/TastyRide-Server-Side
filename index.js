const express = require('express')
require('dotenv').config()
const cors = require('cors')
const connectDB = require('./utils/db')
const app = express()
const port = process.env.PORT || 8000

const authRoutes = require('./routes/authRoutes')
const foodRoutes = require('./routes/foodRoutes')

//Middle Ware
app.use(cors())
app.use(express.json())



//Mongoose
connectDB()
app.use('/auth', authRoutes)
app.use('/api', foodRoutes)



app.get('/', async (req, res) => {
    res.send('tasty food application run successfully')
})



app.listen(port, () => { console.log(`TastyRide Run on ${prot}`) })