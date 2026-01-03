const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
// src/app.js

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");     // singular
const attendanceRoutes = require("./routes/attendance"); // same spelling as file
const timeOffRoutes = require("./routes/timeoff");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrm-system")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timeoff", timeOffRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({status: "Server running ✅"});
});

// Error handling
// Error handling
app.use((err, req, res, next) => {
  console.error("Internal Error Stack:", err.stack); // Log the stack for better debugging
  
  // Ensure we send a response so the request doesn't hang
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
