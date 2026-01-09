const express = require("express");
const router = express.Router();


const {
  adminLogin,
  registerAdmin,
  adminLogout,
  getAllInstructors,
  addInstructor,
  updateInstructor,
  toggleInstructorStatus,
  deleteInstructor,
} = require("../controllers/adminController");

const { verifyAdminToken } = require("../middleware/auth");

router.post("/login", adminLogin);
router.post("/register", registerAdmin);
router.post("/logout", adminLogout);
router.get("/verify", verifyAdminToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});
router.get("/instructors", verifyAdminToken, getAllInstructors);
router.post("/instructors", verifyAdminToken, addInstructor);
router.put("/instructors/:id", verifyAdminToken, updateInstructor);
router.patch(
  "/instructors/:id/status",
  verifyAdminToken,
  toggleInstructorStatus
);
router.delete("/instructors/:id", verifyAdminToken, deleteInstructor);

module.exports = router;
