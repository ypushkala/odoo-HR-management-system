const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: {type: Date, required: true, index: true},
    checkInTime: String,
    checkOutTime: String,
    workHours: Number,
    extraHours: {type: Number, default: 0},
    breakDuration: {type: Number, default: 1},

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "ON_LEAVE", "WORK_FROM_HOME"],
      default: "ABSENT",
    },

    remarks: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

// Unique compound index
attendanceSchema.index({employeeID: 1, date: 1}, {unique: true});

module.exports = mongoose.model("Attendance", attendanceSchema);
