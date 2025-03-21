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
    img: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    }
})

const Ad = mongoose.model("Ad", adSchema)

module.exports = Ad