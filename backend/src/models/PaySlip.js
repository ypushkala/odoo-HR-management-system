const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    paymentMonth: {type: String, required: true},

    earnings: {
      basicSalary: {type: Number, default: 0},
      HRA: {type: Number, default: 0},
      standardAllowance: {type: Number, default: 0},
      performanceBonus: {type: Number, default: 0},
      leaveTravel: {type: Number, default: 0},
      fixedAllowance: {type: Number, default: 0},
      totalEarnings: {type: Number, default: 0},
    },

    deductions: {
      professionalTax: {type: Number, default: 0},
      incomeTax: {type: Number, default: 0},
      PFContribution: {type: Number, default: 0},
      totalDeductions: {type: Number, default: 0},
    },

    totalPayableDays: {type: Number, default: 0},
    absentDays: {type: Number, default: 0},
    payableAmount: {type: Number, default: 0},

    status: {
      type: String,
      enum: ["DRAFT", "APPROVED", "SENT", "PAID"],
      default: "DRAFT",
    },

    issuedDate: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

module.exports = mongoose.model("Payslip", payslipSchema);
