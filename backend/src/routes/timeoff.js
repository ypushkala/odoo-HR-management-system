const express = require("express");
// Change from "../../" to "../"
const timeOffController = require("../controllers/timeoffController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post("/request", authenticate, timeOffController.requestTimeOff);
router.get("/requests", authenticate, timeOffController.getRequests);
router.put(
  "/requests/:requestID/approve",
  authenticate,
  authorize(["ADMIN", "HR_OFFICER"]),
  timeOffController.approveRequest
);
router.put(
  "/requests/:requestID/reject",
  authenticate,
  authorize(["ADMIN", "HR_OFFICER"]),
  timeOffController.rejectRequest
);

module.exports = router;
