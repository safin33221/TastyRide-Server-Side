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

    const userId = req.params.id;

    const user = await User.findById(userId);

    if (user?.riderStatus !== "none") {
      return res
        .status(400)
        .json({ message: "You already have an application!" });
    }

    const application = new Rider({
      userId,
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
