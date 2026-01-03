const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    employeeCode: {type: String, unique: true, required: true},
    firstName: String,
    lastName: String,
    dateOfJoining: Date,
    department: String,
    jobPosition: String,
    companyName: String,

    // Personal
    dateOfBirth: Date,
    gender: {type: String, enum: ["M", "F", "Other"]},
    maritalStatus: String,
    nationality: String,
    personalEmail: String,

    // Address
    residingAddress: String,
    location: String,
    mobile: String,

    // Banking
    bankName: String,
    accountNumber: String,
    IFSCCode: String,
    PANNumber: String,
    UANNumber: String,

    manager: {type: mongoose.Schema.Types.ObjectId, ref: "Employee"},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

module.exports = mongoose.model("Employee", employeeSchema);
