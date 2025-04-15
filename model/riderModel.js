const mongoose = require("mongoose");

const workAvailabilitySchema = new mongoose.Schema({
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    }],
    startTime: {
      type: String, 
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  });

const riderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phoneNumber:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  presentAddress: {
    type: String,
    required: true,
  },
  parmanentAddress: {
    type: String,
    // default: "",
  },
  profilePhoto: {
    type: String, 
    required: true,
  },
  nationalId: {
    type: String,
    required: true,
    // In production, encrypt this field
  },
  nidPicture: {
    type: String, 
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'scooter'],
    required: true,
  },
  vehicleNumberPlate: {
    type: String,
    required: true,
  },
  drivingLicense: {
    type: String,
    required: true,
  },
  drivingLicenseImage: {
    type: String, 
    required: true,
  },
  preferredWorkArea: {
    type: String,
    required: true,
  },
  workAvailability: {
    type: workAvailabilitySchema,
    required: true,
  },
  hasSmartphone: {
    type: Boolean,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'wallet'],
    required: true,
  },
  bankAccountNumber: {
    type: String,
    required: function () {
      return this.paymentMethod === 'bank';
    },
    // In production, encrypt this field
  },
  mobileWalletProvider: {
    type: String,
    enum: ['bKash', 'Nagad', 'Rocket', null], 
    required: function () {
      return this.paymentMethod === 'wallet';
    },
  },
  mobileWalletNumber: {
    type: String,
    required: function () {
      return this.paymentMethod === 'wallet';
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Rider = mongoose.model("Rider", riderSchema);
module.exports = Rider;
