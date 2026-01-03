const TimeOff = require("../models/TimeOff");

exports.requestTimeOff = async (req, res) => {
  try {
    const {employeeID, timeOffType, startDate, endDate, reason} = req.body;

    const totalDays =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    const timeoff = new TimeOff({
      employeeID,
      timeOffType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: "PENDING",
    });

    await timeoff.save();

    res
      .status(201)
      .json({success: true, message: "Request submitted", data: timeoff});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.getRequests = async (req, res) => {
  try {
    const {status} = req.query;

    // Employees see only their requests
    let query = {};
    if (req.user.role === "EMPLOYEE") {
      const Employee = require("../../models/Employee");
      const empUser = await Employee.findOne({userID: req.user.userID});
      query.employeeID = empUser._id;
    }

    if (status) query.status = status;

    const requests = await TimeOff.find(query).populate(
      "employeeID approvedBy"
    );

    res.json({success: true, count: requests.length, data: requests});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const {requestID} = req.params;

    const timeoff = await TimeOff.findByIdAndUpdate(
      requestID,
      {status: "APPROVED", approvedBy: req.user.userID},
      {new: true}
    );

    if (!timeoff) {
      return res
        .status(404)
        .json({success: false, message: "Request not found"});
    }

    res.json({success: true, message: "Request approved", data: timeoff});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const {requestID} = req.params;
    const {rejectionReason} = req.body;

    const timeoff = await TimeOff.findByIdAndUpdate(
      requestID,
      {status: "REJECTED", rejectionReason},
      {new: true}
    );

    if (!timeoff) {
      return res
        .status(404)
        .json({success: false, message: "Request not found"});
    }

    res.json({success: true, message: "Request rejected", data: timeoff});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};
