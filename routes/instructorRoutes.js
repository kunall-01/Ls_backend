const express = require("express");
const router = express.Router();
const controller = require("../controllers/instructorController");

const {
  loginInstructor,
  logoutInstructor,
  getInstructorProfile,
  getAllInstructors,
  updateInstructor,
  toggleStatus,
  deleteInstructor,
} = require("../controllers/instructorController");

const { verifyInstructor } = require("../middleware/auth");

router.post("/login", loginInstructor);
router.post("/logout", logoutInstructor);

router.get("/verify", verifyInstructor, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

router.get("/getallinstructor", getAllInstructors);

router.get("/profile", verifyInstructor, getInstructorProfile);
router.get("/", verifyInstructor, getAllInstructors);
router.put("/:id", verifyInstructor, updateInstructor);
router.patch("/status/:id", verifyInstructor, toggleStatus);
router.delete("/:id", verifyInstructor, deleteInstructor);

module.exports = router;
