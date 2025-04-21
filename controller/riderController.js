const mongoose = require('mongoose')
const User = require("./../model/authModel");
const Rider = require('./../model/riderModel')
const ObjectId = mongoose.Types.ObjectId;
const Order = require('./../model/orderModel')
// apply for rider
const applyRider = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      phoneNumber,
      email,
      presentAddress,
      permanentAddress,
      profilePhoto,
      nationalId,
      nidPicture,
      vehicleType,
      vehicleNumberPlate,
      drivingLicense,
      drivingLicenseImage,
      preferredWorkArea,
      workAvailability,
      hasSmartphone,
      paymentMethod,
      bankAccountNumber,
      mobileWalletProvider,
      mobileWalletNumber,
    } = req.body;

    const { userEmail } = req.params;


    const user = await User.findOne({ email: userEmail });

    // console.log(user);


    if (user?.riderStatus !== "none") {
      return res
        .status(400)
        .json({ message: "You already have an application!" });
    }

    const application = new Rider({
      userId: user?._id,
      fullName,
      dateOfBirth,
      phoneNumber,
      email,
      presentAddress,
      permanentAddress,
      profilePhoto,
      nationalId,
      nidPicture,
      vehicleType,
      vehicleNumberPlate,
      drivingLicense,
      drivingLicenseImage,
      preferredWorkArea,
      workAvailability,
      hasSmartphone,
      paymentMethod,
      bankAccountNumber,
      mobileWalletProvider,
      mobileWalletNumber,
      status: "pending",
    });

    // console.log(application);
    // console.log(user);

    await application.save();

    // console.log(application);

    user.riderStatus = "pending";
    user.phone = phoneNumber;
    await user.save();


    // console.log(application, user)

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application._id,
    });
  } catch (error) {
    // console.log("server error", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


//get all riders

const getAllRidersApplications = async (req, res) => {
  try {
    const result = await Rider.find()
    res.status(200).send(result)
  } catch (error) {
    res.status(500).send({ message: 'server error' })
  }
}

//update status

const updateStatus = async (req, res) => {
  try {
    const { email, status } = req.body
    console.log(email, status);
    const query = { email }
    const updateDoc = {
      $set: {
        status: status
      }
    }
    const result = await Rider.findOneAndUpdate(query, updateDoc)
    if (status === 'approved') {
      const query = { email }
      const UserDoc = {
        $set: {
          role: 'rider',
          riderStatus: 'approved'
        }
      }
      console.log(email);
      await User.findOneAndUpdate(query, UserDoc)
      console.log(user);
    } else {
      const query = { email }
      const UserDoc = {
        $set: {
          riderStatus: 'rejected'
        }
      }
      console.log(email);
      await User.findOneAndUpdate(query, UserDoc)
      res.status(200).send({ message: 'rejected' })
    }

    res.status(200).send({ message: "update successfully", result: result })
  } catch (error) {
    res.status(500).send({ message: "server error" })
  }


}


// update order acceptedBy for rider 
const acceptedByRider = async (req, res) => {
  const {orderId} = req.params
  const {acceptedBy} = req.body
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { acceptedBy, createdAt: Date.now() }
    );
    if (!order) {
      return res.status(404).send({ success: false, message: "Order not found" });
    }
    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in acceptedByRider:", error);
    res.status(500).send({ success: false, message: "Server Error", error: error.message });
  }
}

module.exports = {
  applyRider,
  getAllRidersApplications,
  updateStatus,
  acceptedByRider
};
