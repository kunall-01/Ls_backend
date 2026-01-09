const Admin = require("../models/Admin");
const Instructor = require("../models/Instructor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ------------------------ ADMIN LOGIN / LOGOUT / REGISTER ------------------------

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.adminLogout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------ INSTRUCTOR MANAGEMENT ------------------------

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch instructors", error: err.message });
  }
};

exports.addInstructor = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Instructor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Instructor already exists" });

    const newInstructor = new Instructor({
      name,
      email,
      password,
    });

    await newInstructor.save();
    res.status(201).json(newInstructor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add instructor", error: err.message });
  }
};

exports.updateInstructor = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const instructor = await Instructor.findById(id);
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    instructor.name = name || instructor.name;
    instructor.email = email || instructor.email;
    if (password) {
      instructor.password = password;
    }

    await instructor.save();
    res.status(200).json(instructor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update instructor", error: err.message });
  }
};

exports.toggleInstructorStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findById(id);
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    instructor.status = instructor.status === "active" ? "blocked" : "active";
    await instructor.save();

    res.status(200).json(instructor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle status", error: err.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await Instructor.findByIdAndDelete(id);
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete instructor", error: err.message });
  }
};
