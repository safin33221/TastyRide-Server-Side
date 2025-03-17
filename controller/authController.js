const User = require('../model/authModel')

const registerUser= async (req, res) => {
    const { username, email, photo } = req.body
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exist' })
        }

        const nweUser = new User({
            username,
            photo,
            email
        })
        console.log(nweUser);

        await nweUser.save()

        res.status(201).send({ message: 'User Registered Successfully' })
    } catch (error) {
        res.status(500).send({ message: 'server Error' })
    }
}


module.exports = { registerUser }