const express = require("express");// Remove "config/" from the path
const employeeController = require("../controllers/employeeController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "HR_OFFICER"]),
  employeeController.createEmployee
);
router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "HR_OFFICER"]),
  employeeController.getAllEmployees
);
router.get("/:employeeID", authenticate, employeeController.getEmployee);
router.put("/:employeeID", authenticate, employeeController.updateEmployee);

module.exports = router;
