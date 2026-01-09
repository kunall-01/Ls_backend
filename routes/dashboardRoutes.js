const express = require("express");
const router = express.Router();
const Instructor = require("../models/Instructor");
const Student = require("../models/Student");
const Course = require("../models/Course"); // assuming you have one

router.get("/stats", async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalUsers = await Student.countDocuments();
    const activeInstructors = await Instructor.countDocuments({
      status: "active",
    });

    res.json({
      totalCourses,
      totalUsers,
      activeInstructors,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
