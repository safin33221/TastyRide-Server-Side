const notification = require('../model/notification')
//post new notification
const newNotification = async (req, res) => {
    const data = req.body;
    // console.log(data);
    // if (!cus_email, !title, !type, !read, !createdAt) {
    //     res.status(401).send({ message: 'required all filds' })
    // }

    console.log(data);
    const newNotification = await new notification(data)
    // console.log(newNotification);

    await newNotification.save()
    res.status(200).send({ message: 'notification success', success: true, data: notification })
}


// get notification data

const getNotification = async (req, res) => {
    try {
        const { email } = req.params;
        const query = { to_email: email }
        const notifications = await notification.find(query)
        res.status(200).send(notifications)
    } catch (error) {
        res.status(404).send({ message: 'sever error', error })
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { email } = req.params;
        const query = { to_email: email }
        const result = await notification.deleteMany(query)
        res.status(200).send({ message: 'deleted success' })
    } catch (error) {
        res.status(500).send('sever Error', error)
    }
}

module.exports = { newNotification, getNotification, deleteNotification }