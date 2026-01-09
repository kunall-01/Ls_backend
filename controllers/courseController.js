const Course = require("../models/Course");

// GET all
exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// POST create
exports.createCourse = async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json(newCourse);
};

// PUT update
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// DELETE
exports.deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
};
