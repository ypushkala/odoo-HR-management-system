const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  loginID: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  name: String,
  phone: String,
  companyName: String,
  role: {
    type: String,
    enum: ["ADMIN", "HR_OFFICER", "EMPLOYEE"],
    default: "EMPLOYEE",
  },
  profilePicture: String,
  isActive: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

// ✅ CORRECTED pre-save hook
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) {
//       return next(); // Exit early if password unchanged
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next(); // Only called once, after hash
//   } catch (error) {
//     next(error);
//   }
// });
// ✅ REVISED pre-save hook (Async/Await Pattern)
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return; // Just return; Mongoose knows this is "next()"
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() call needed here for async hooks
  } catch (error) {
    throw error; // Rethrowing will be caught by Mongoose as an error
  }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate login ID static method
userSchema.statics.generateLoginID = async function (
  firstName,
  lastName,
  joiningYear,
  companyCode = "OI"
) {
  const initials = (firstName[0] + lastName[0]).toUpperCase();
  const prefix = companyCode + initials + joiningYear;
  const count = await this.countDocuments({loginID: new RegExp(`^${prefix}`)});
  const serialNumber = String(count + 1).padStart(4, "0");
  return prefix + serialNumber;
};

module.exports = mongoose.model("User", userSchema);
