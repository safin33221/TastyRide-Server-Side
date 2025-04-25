const mongoose = require("mongoose");


const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    
})

const Ad = mongoose.model("Ad", adSchema)

module.exports = Ad