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
    },
    description:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    Iigredients:{
        type: Array,
        require: true
    },
    availability:{
        type:Boolean,
        require:true
    },
    email: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }
})

const Food = mongoose.model("Food", foodSchema)

module.exports = Food