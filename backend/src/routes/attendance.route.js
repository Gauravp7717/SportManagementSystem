// routes/attendance.routes.js
import express from "express";
import {
  markAttendance,
  bulkMarkStudentAttendance,
  getAttendanceByDateRange,
  getTodayAttendance,
  updateAttendance,
  getAttendanceSummary,
  getEntityAttendanceReport,
} from "../controllers/attendance.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authrizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// ✅ COACHES - Can manage STUDENT attendance only
router.post(
  "/mark-student",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  markAttendance
);

router.post(
  "/mark-students",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  bulkMarkStudentAttendance
);

router.get(
  "/today-students",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getTodayAttendance
);

router.get(
  "/students/range",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getAttendanceByDateRange
);

router.put(
  "/student/:id",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  updateAttendance
);

// ✅ CLUB ADMIN - Can manage BOTH coach & student attendance
router.post(
  "/mark-coach",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  markAttendance
);

router.put(
  "/coach/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  updateAttendance
);

// ✅ COMMON ROUTES - Reports & Summary (accessible to both)
router.get(
  "/today",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getTodayAttendance
);

router.get(
  "/range",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getAttendanceByDateRange
);

router.get(
  "/summary",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getAttendanceSummary
);

router.get(
  "/report",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  getEntityAttendanceReport
);

// ✅ BULK OPERATIONS (Club Admin + Coaches for students)
router.post(
  "/bulk-students",
  verifyJWT,
  authrizeRole("COACH", "CLUB_ADMIN"),
  bulkMarkStudentAttendance
);

// ✅ CLUB ADMIN ONLY - Coach attendance bulk (if needed later)
// router.post("/bulk-coaches", verifyJWT, authrizeRole("CLUB_ADMIN"), bulkMarkCoachAttendance);

export default router;
