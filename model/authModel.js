const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


//Restaurant Details Sub-Schema
const restaurantDetailsSchema = new mongoose.Schema({
    restaurantName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    profilePhoto: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    description: {
        type: String
    },
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'restaurant'],
        default: 'customer',
    },
    failedLoginAttempts: { type: Number, default: 0 }, // কয়বার ভুল করেছে
    lockUntil: { type: Date, default: null }, // কখন পর্যন্ত lock থাকবে
    restaurantDetails: {
        type: restaurantDetailsSchema,
        default: null
    }
})

//presave middleware for hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hashing.');
        return next();
    }

    try {
        console.log('Hashing password:', this.password); // Log the plain-text password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // console.log('Hashed password:', this.password); // Log the hashed password
        next();
    } catch (error) {
        // console.error('Error hashing password:', error);
        next(error);
    }
});

//For compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User