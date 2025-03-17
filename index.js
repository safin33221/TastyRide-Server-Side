const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const  connectDB  = require('./utils/db')
const app = express()
const prot = process.env.PORT || 8080

//Middle Ware
app.use(cors())
app.use(express.json())



//Mongoose
connectDB()
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('mogoose conntected succefully'))
//     .catch((err) => console.log(err))


app.get('/', async (req, res) => {
    res.send('tasty food application run successfully')
})



app.listen(prot, () => { console.log(`TastyRide Run on ${prot}`) })