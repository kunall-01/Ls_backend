const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    technologies: [String],
    duration: String,
    level: String,
    originalPrice: Number,
    currentPrice: Number,
    category: String,
    instructor: {
      name: String,
      avatar: String,
      level: String,
    },
    rating: Number,
    students: Number,
    color: String,
    badge: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
