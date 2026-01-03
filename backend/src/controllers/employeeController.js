const Employee = require("../models/Employee");
const User = require("../models/User");

exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfJoining,
      department,
      jobPosition,
      email,
      phone,
      ...otherDetails
    } = req.body;

    if (!firstName || !lastName || !email || !department) {
      return res
        .status(400)
        .json({success: false, message: "Missing required fields"});
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(400)
        .json({success: false, message: "Email already exists"});
    }

    const loginID = await User.generateLoginID(
      firstName,
      lastName,
      new Date(dateOfJoining).getFullYear()
    );
    const tempPassword = "Temp@" + Math.random().toString(36).slice(-8);

    const user = new User({
      loginID,
      email,
      password: tempPassword,
      name: `${firstName} ${lastName}`,
      phone,
      companyName: req.body.companyName || "Odoo India",
      role: "EMPLOYEE",
    });

    await user.save();

    const employee = new Employee({
      userID: user._id,
      employeeCode: loginID,
      firstName,
      lastName,
      dateOfJoining,
      department,
      jobPosition,
      companyName: user.companyName,
      mobile: phone,
      ...otherDetails,
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: "Employee created",
      data: {employeeCode: loginID, email},
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const {department} = req.query;
    let query = {isActive: true};
    if (department) query.department = department;

    const employees = await Employee.find(query)
      .populate("userID", "email phone")
      .limit(100);

    res.json({success: true, count: employees.length, data: employees});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeID).populate(
      "userID"
    );

    if (!employee) {
      return res
        .status(404)
        .json({success: false, message: "Employee not found"});
    }

    // Check authorization
    if (req.user.role === "EMPLOYEE") {
      const empUser = await Employee.findOne({userID: req.user.userID});
      if (empUser._id.toString() !== req.params.employeeID) {
        return res.status(403).json({success: false, message: "Access denied"});
      }
    }

    res.json({success: true, data: employee});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const {employeeID} = req.params;
    const updates = req.body;

    // Restrict employee updates
    if (req.user.role === "EMPLOYEE") {
      const allowedFields = ["personalEmail", "mobile", "residingAddress"];
      Object.keys(updates).forEach((key) => {
        if (!allowedFields.includes(key)) delete updates[key];
      });
    }

    const employee = await Employee.findByIdAndUpdate(employeeID, updates, {
      new: true,
    });

    if (!employee) {
      return res
        .status(404)
        .json({success: false, message: "Employee not found"});
    }

    res.json({success: true, message: "Employee updated", data: employee});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};
