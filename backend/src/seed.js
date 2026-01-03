const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");
const TimeOff = require("./models/Timeoff");

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hrm-system"
    );
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await TimeOff.deleteMany({});
    console.log("✓ Cleared existing data");

    // Create Admin User
    const adminUser = await User.create({
      loginID: "OIADM20260001",
      email: "admin@odoo.com",
      password: "Admin@123",
      name: "Admin User",
      phone: "+91-9999999999",
      companyName: "Odoo India",
      role: "ADMIN",
    });
    console.log("✓ Created admin user:", adminUser.loginID);

    // Create HR User
    const hrUser = await User.create({
      loginID: "OIHR020260001",
      email: "hr@odoo.com",
      password: "HR@123",
      name: "HR Officer",
      phone: "+91-8888888888",
      companyName: "Odoo India",
      role: "HR_OFFICER",
    });
    console.log("✓ Created HR user:", hrUser.loginID);

    // Create 5 Employees
    const employees = [];
    const employeeData = [
      {
        name: "John Doe",
        email: "john@odoo.com",
        phone: "+91-9876543210",
        department: "Engineering",
        designation: "Senior Developer",
        manager: "John Manager",
      },
      {
        name: "Jane Smith",
        email: "jane@odoo.com",
        phone: "+91-9876543211",
        department: "HR",
        designation: "HR Specialist",
        manager: "Jane Manager",
      },
      {
        name: "Mike Johnson",
        email: "mike@odoo.com",
        phone: "+91-9876543212",
        department: "Sales",
        designation: "Sales Executive",
        manager: "Mike Manager",
      },
      {
        name: "Sarah Williams",
        email: "sarah@odoo.com",
        phone: "+91-9876543213",
        department: "Engineering",
        designation: "Junior Developer",
        manager: "John Manager",
      },
      {
        name: "Alex Brown",
        email: "alex@odoo.com",
        phone: "+91-9876543214",
        department: "Finance",
        designation: "Finance Analyst",
        manager: "Alex Manager",
      },
    ];

    // for (let i = 0; i < employeeData.length; i++) {
    //   const userData = await User.create({
    //     loginID: `OIEE${i + 1}20260001`,
    //     email: employeeData[i].email,
    //     password: "Employee@123",
    //     name: employeeData[i].name,
    //     phone: employeeData[i].phone,
    //     companyName: "Odoo India",
    //     role: "EMPLOYEE",
    //   });

    //   const employeeRecord = await Employee.create({
    //     userId: userData._id,
    //     employeeID: `EMP${String(i + 1).padStart(3, "0")}`,
    //     department: employeeData[i].department,
    //     designation: employeeData[i].designation,
    //     manager: employeeData[i].manager,
    //     dateOfJoining: new Date(2024, 0, 15),
    //     salary: 50000 + i * 5000,
    //   });

    //   employees.push(employeeRecord);
    //   console.log(`✓ Created employee: ${userData.name}`);
    // }
    for (let i = 0; i < employeeData.length; i++) {
      const userData = await User.create({
        loginID: `OIEE${i + 1}20260001`,
        email: employeeData[i].email,
        password: "Employee@123",
        name: employeeData[i].name,
        phone: employeeData[i].phone,
        companyName: "Odoo India",
        role: "EMPLOYEE",
      });

      const employeeRecord = await Employee.create({
        userID: userData._id, // Changed from userId to userID
        employeeCode: `EMP${String(i + 1).padStart(3, "0")}`, // Changed from employeeID
        department: employeeData[i].department,
        designation: employeeData[i].designation,
        // manager: employeeData[i].manager, // COMMENT THIS OUT for now
        dateOfJoining: new Date(2024, 0, 15),
        salary: 50000 + i * 5000,
      });

      employees.push(employeeRecord);
      console.log(`✓ Created employee: ${userData.name}`);
    }
    // Create Attendance Records for today
    const today = new Date();
    for (let i = 0; i < employees.length; i++) {
      await Attendance.create({
        employeeID: employees[i]._id,
        date: today,
        checkInTime: "09:00 AM",
        checkOutTime: "05:30 PM",
        workHours: 8.5,
        extraHours: 0.5,
        status: "PRESENT",
        breakDuration: 1,
      });
    }
    console.log("✓ Created attendance records");

    // Create TimeOff Requests
    // const tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() + 1);

    // await TimeOff.create({
    //   employeeID: employees[0]._id,
    //   leaveType: "PAID",
    //   startDate: tomorrow,
    //   endDate: tomorrow,
    //   days: 1,
    //   status: "PENDING",
    //   reason: "Personal work",
    // });

    // await TimeOff.create({
    //   employeeID: employees[1]._id,
    //   leaveType: "SICK",
    //   startDate: tomorrow,
    //   endDate: tomorrow,
    //   days: 1,
    //   status: "APPROVED",
    //   reason: "Sick leave",
    // });
    // Create TimeOff Requests
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await TimeOff.create({
      employeeID: employees[0]._id,
      timeOffType: "PAID_TIME_OFF", // Matches enum in timeoff.js
      startDate: tomorrow,
      endDate: tomorrow,
      totalDays: 1,
      status: "PENDING",
      reason: "Personal work",
    });

    await TimeOff.create({
      employeeID: employees[1]._id,
      timeOffType: "SICK_LEAVE", // Matches enum in timeoff.js
      startDate: tomorrow,
      endDate: tomorrow,
      totalDays: 1,
      status: "APPROVED",
      reason: "Sick leave",
    });
    console.log("✓ Created TimeOff requests");
    console.log("\n✅ Database seeding completed!\n");
    console.log("Test Credentials:");
    console.log("Admin - ID: OIADM20260001, Pass: Admin@123");
    console.log("HR    - ID: OIHR020260001, Pass: HR@123");
    console.log("Emp   - ID: OIEE120260001, Pass: Employee@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
