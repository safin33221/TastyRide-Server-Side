const User = require("./../model/authModel");
const Rider = require("./../model/riderModal");

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

    const {userEmail} = req.params;

    const user = await User.findOne({email: userEmail});

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

    await application.save();

    user.riderStatus = "pending";
    user.phone = phoneNumber;
    await user.save();

    console.log(application, user)
    
    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  applyRider,
};
