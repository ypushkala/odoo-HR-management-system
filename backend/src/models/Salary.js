const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    employeeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      unique: true,
      required: true,
    },
    monthlyWage: {type: Number, required: true, min: 0},
    yearlyWage: Number,
    wageType: {type: String, enum: ["Fixed", "Variable"], default: "Fixed"},

    // Components (percentages)
    components: {
      basicSalary: {amount: Number, percentage: {type: Number, default: 50}},
      HRA: {amount: Number, percentage: {type: Number, default: 15}},
      standardAllowance: {
        amount: Number,
        percentage: {type: Number, default: 10},
      },
      performanceBonus: {
        amount: Number,
        percentage: {type: Number, default: 15},
      },
      leaveTravel: {amount: Number, percentage: {type: Number, default: 5}},
      fixedAllowance: {amount: Number, percentage: {type: Number, default: 5}},
    },

    // Deductions
    deductions: {
      professionalTax: {type: Number, default: 200},
      incomeTax: {type: Number, default: 0},
      PFContribution: {type: Number, default: 0},
    },

    // Config
    workingDaysPerWeek: {type: Number, default: 5},
    breakTimePerDay: {type: Number, default: 1},
    PFRate: {type: Number, default: 12},

    effectiveDate: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
  },
  {timestamps: true}
);

// Auto-calculate component amounts
salarySchema.pre("save", function (next) {
  const wage = this.monthlyWage;
  this.components.basicSalary.amount = Math.round(
    wage * (this.components.basicSalary.percentage / 100)
  );
  this.components.HRA.amount = Math.round(
    wage * (this.components.HRA.percentage / 100)
  );
  this.components.standardAllowance.amount = Math.round(
    wage * (this.components.standardAllowance.percentage / 100)
  );
  this.components.performanceBonus.amount = Math.round(
    wage * (this.components.performanceBonus.percentage / 100)
  );
  this.components.leaveTravel.amount = Math.round(
    wage * (this.components.leaveTravel.percentage / 100)
  );
  this.components.fixedAllowance.amount = Math.round(
    wage * (this.components.fixedAllowance.percentage / 100)
  );

  this.deductions.PFContribution = Math.round(
    this.components.basicSalary.amount * (this.PFRate / 100)
  );
  this.yearlyWage = wage * 12;
  next();
});

module.exports = mongoose.model("Salary", salarySchema);
