const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema({
    name:String,
    price:Number,
    quantity:Number,
    image:String,
    totalPrice:Number,
    userEmail:String,
    foodOwner: String,
    foodId:String
})

const Cart = mongoose.model("cart", cartSchema)
module.exports = Cart