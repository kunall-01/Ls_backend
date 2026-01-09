const Instructor = require("../models/Instructor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login
exports.loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const instructor = await Instructor.findOne({ email });

    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    const isMatch = await instructor.matchPassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (instructor.status === "blocked") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const token = jwt.sign(
      { id: instructor._id, role: "instructor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("instructorToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      instructor: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout
exports.logoutInstructor = (req, res) => {
  res.clearCookie("instructorToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successful" });
};

// Get Profile
exports.getInstructorProfile = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.instructor.id);
    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    res.status(200).json({
      id: instructor._id,
      name: instructor.name,
      email: instructor.email,
      status: instructor.status,
      courses: instructor.courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add
exports.addInstructor = async (req, res) => {
  try {
    const { name, email, password, courses } = req.body;

    const existing = await Instructor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstructor = new Instructor({
      name,
      email,
      password: hashedPassword,
      courses,
    });

    await newInstructor.save();
    res.status(201).json(newInstructor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update
exports.updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, courses } = req.body;

    const updated = await Instructor.findByIdAndUpdate(
      id,
      { name, email, courses },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Toggle Status
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);

    if (!instructor)
      return res.status(404).json({ message: "Instructor not found" });

    instructor.status = instructor.status === "active" ? "blocked" : "active";
    await instructor.save();

    res.json(instructor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    await Instructor.findByIdAndDelete(id);
    res.json({ message: "Instructor deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
