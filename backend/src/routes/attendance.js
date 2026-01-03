const express = require("express");
const attendanceController = require("../controllers/attendanceController");
// Change from "../../" to "../" because middleware is a sibling folder to routes
const authenticate = require("../middleware/authenticate");
const router = express.Router();

router.post("/check-in", authenticate, attendanceController.checkIn);
router.post("/check-out", authenticate, attendanceController.checkOut);
router.get("/", authenticate, attendanceController.getAttendance);

module.exports = router;
