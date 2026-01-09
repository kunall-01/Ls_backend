const Student = require("../models/Student");

exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

exports.addStudent = async (req, res) => {
  const { name, email, course, status } = req.body;
  const student = new Student({
    name,
    email,
    course,
    status,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    lastActive: "Just now",
  });
  await student.save();
  res.json(student);
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, course, status } = req.body;
  const updated = await Student.findByIdAndUpdate(
    id,
    { name, email, course, status },
    { new: true }
  );
  res.json(updated);
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  await Student.findByIdAndDelete(id);
  res.json({ message: "Student deleted" });
};
