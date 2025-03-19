const { default: mongoose } = require("mongoose");


const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        require: true
    },
    foodImg: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    review: {
        type: String,
        require: true
    }
})

const Food = mongoose.model("Food", foodSchema)

module.exports = Food