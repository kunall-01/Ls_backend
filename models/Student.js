const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  enrollmentDate: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  lastActive: String,
  avatar: String,
});

module.exports = mongoose.model("Student", studentSchema);
