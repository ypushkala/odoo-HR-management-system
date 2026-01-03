const Attendance = require("../models/Attendance");
const Salary = require("../models/Salary"); // if you actually use this

exports.checkIn = async (req, res) => {
  try {
    const {employeeID} = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({employeeID, date: today});

    if (attendance && attendance.checkInTime) {
      return res
        .status(400)
        .json({success: false, message: "Already checked in today"});
    }

    if (!attendance) {
      attendance = new Attendance({employeeID, date: today});
    }

    const now = new Date();
    attendance.checkInTime = now.toLocaleTimeString("en-IN");
    attendance.status = "PRESENT";

    await attendance.save();

    res.json({
      success: true,
      message: "Checked in successfully",
      checkInTime: attendance.checkInTime,
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.checkOut = async (req, res) => {
  try {
    const {employeeID} = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({employeeID, date: today});

    if (!attendance || !attendance.checkInTime) {
      return res
        .status(400)
        .json({success: false, message: "No check-in found"});
    }

    if (attendance.checkOutTime) {
      return res
        .status(400)
        .json({success: false, message: "Already checked out"});
    }

    const now = new Date();
    attendance.checkOutTime = now.toLocaleTimeString("en-IN");

    // Calculate work hours
    const checkIn = new Date(`2000-01-01 ${attendance.checkInTime}`);
    const checkOut = new Date(`2000-01-01 ${attendance.checkOutTime}`);
    const workMinutes =
      (checkOut - checkIn) / (1000 * 60) - attendance.breakDuration * 60;
    attendance.workHours = Math.round((workMinutes / 60) * 100) / 100;
    attendance.extraHours = Math.max(0, attendance.workHours - 8);

    await attendance.save();

    res.json({
      success: true,
      message: "Checked out",
      workHours: attendance.workHours,
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const {employeeID, month, year} = req.query;

    // Authorization check
    if (req.user.role === "EMPLOYEE") {
      const Employee = require("../models/Employee");
      const empUser = await Employee.findOne({userID: req.user.userID});
      if (empUser._id.toString() !== employeeID) {
        return res.status(403).json({success: false, message: "Access denied"});
      }
    }

    let query = {employeeID};
    if (month && year) {
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      query.date = {$gte: startDate, $lte: endDate};
    }

    const records = await Attendance.find(query).sort({date: -1});

    res.json({success: true, count: records.length, data: records});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};
