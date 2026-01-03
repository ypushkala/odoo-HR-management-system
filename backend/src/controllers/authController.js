// const User = require("../../models/User");
// const Employee = require("../../models/Employee");
// const jwt = require("jsonwebtoken");
// Change from "../../" to "../"
const User = require("../models/User");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
// Generate temporary password
const generatePassword = () => "Temp@" + Math.random().toString(36).slice(-8);

exports.signup = async (req, res) => {
  try {
    const {companyName, name, email, phone} = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({success: false, message: "Missing required fields"});
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(400)
        .json({success: false, message: "Email already registered"});
    }

    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "User";
    const joiningYear = new Date().getFullYear();

    const loginID = await User.generateLoginID(
      firstName,
      lastName,
      joiningYear
    );
    const tempPassword = generatePassword();

    const newUser = new User({
      loginID,
      email,
      password: tempPassword,
      name,
      phone,
      companyName,
      role: "EMPLOYEE",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {loginID, email, passwordSent: true},
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.signin = async (req, res) => {
  try {
    const {loginID, password} = req.body;

    if (!loginID || !password) {
      return res
        .status(400)
        .json({success: false, message: "LoginID and password required"});
    }

    const user = await User.findOne({loginID}).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({success: false, message: "Invalid credentials"});
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({success: false, message: "Invalid credentials"});
    }

    const token = jwt.sign(
      {
        userID: user._id,
        loginID: user.loginID,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {expiresIn: "24h"}
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        loginID: user.loginID,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};

exports.changePassword = async (req, res) => {
  try {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user.userID).select("+password");
    const isValid = await user.comparePassword(oldPassword);

    if (!isValid) {
      return res
        .status(401)
        .json({success: false, message: "Current password is incorrect"});
    }

    user.password = newPassword;
    await user.save();

    res.json({success: true, message: "Password changed successfully"});
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
};
