const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    timeOffType: {
      type: String,
      enum: [
        "PAID_TIME_OFF",
        "SICK_LEAVE",
        "UNPAID_LEAVE",
        "MATERNITY_LEAVE",
        "PATERNITY_LEAVE",
      ],
      required: true,
    },

    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    totalDays: {type: Number, required: true},

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reason: String,
    rejectionReason: String,
    attachmentUrl: String,

    requestDate: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

module.exports = mongoose.model("TimeOff", timeOffSchema);
