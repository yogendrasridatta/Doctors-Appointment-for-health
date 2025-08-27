const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const doctorCtrl = require("../controllers/doctorController");
const adminCtrl = require("../controllers/adminController");

// ✅ Temporary public route (supports both userId and doctorId)
router.get("/find-by-user/:userId", doctorCtrl.getDoctorByUserId);

// ───────────── PUBLIC ENDPOINTS ─────────────
router.post("/signup", doctorCtrl.doctorSignup);
router.get("/", doctorCtrl.getAllDoctors);
router.get("/approved-doctors", doctorCtrl.getAllApprovedDoctors);

/* ─────────── Get doctor by linked USER ID ─────────── */
router.get("/by-user/:userId", auth.protect, doctorCtrl.getDoctorByUserId);

// ✅ ✅ NEW: Get doctor by doctor ID directly (used by fallback logic)
router.get("/:id", doctorCtrl.getDoctorById);

// ───────────── PROTECTED ENDPOINTS ─────────────
router.use(auth.protect); // All routes below require login

// ✅ ✅ NEW: Booked appointments for doctor
router.get(
  "/booked-appointments/:doctorId",
  doctorCtrl.getBookedAppointments
);

/* Doctor OR Admin: Get all appointments for a doctor */
router.get(
  "/appointments/:doctorId",
  auth.restrictTo("doctor", "admin"),
  doctorCtrl.doctorAppointments
);

/* ✅ Anyone logged in (like a patient) can check availability */
router.post(
  "/check-booking-availability",
  doctorCtrl.checkBookingAvailability
);

/* Doctor-only: Change status */
router.post(
  "/change-appointment-status",
  auth.restrictTo("doctor"),
  doctorCtrl.changeAppointmentStatus
);

/* Doctor-only: Update profile */
router.put(
  "/:id",
  auth.restrictTo("doctor"),
  doctorCtrl.updateDoctor
);

/* Admin-only: View all appointments */
router.get(
  "/appointments",
  auth.restrictTo("admin"),
  adminCtrl.getAllAppointments
);

module.exports = router;
