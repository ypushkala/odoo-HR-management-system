const express = require("express");
const authController = require("../controllers/AuthController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;
