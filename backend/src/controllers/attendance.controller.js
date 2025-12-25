// controllers/attendanceController.js
import {asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import Attendance from "../models/Attendance.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

// ✅ HELPER: Get attendance records with populated data
const getAttendanceWithPopulation = async (filter = {}) => {
  return await Attendance.find(filter)
    .populate({
      path: "tenantId",
      select: "name",
    })
    .populate({
      path: "entityId",
      select:
        "tenantId name email contact dob joiningDate sports batchId fullname salary",
    })
    .sort({ date: -1 });
};

// ✅ 1. Mark attendance (Coaches/Club Admin)
export const markAttendance = asyncHandler(async (req, res) => {
  const { tenantId, entityType, entityId, date, status } = req.body;
  const user = req.user;

  // ✅ Authorization checks
  if (entityType === "student") {
    if (user.role !== "COACH" && user.role !== "CLUB_ADMIN") {
      throw new apiError(403, "Only coaches and club admins can mark student attendance");
    }
  } else if (entityType === "coach") {
    if (user.role !== "CLUB_ADMIN") {
      throw new apiError(403, "Only club admins can mark coach attendance");
    }
  }

  // ✅ Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(tenantId) || !mongoose.Types.ObjectId.isValid(entityId)) {
    throw new apiError(400, "Invalid tenantId or entityId");
  }

  // ✅ Check if record already exists (same day)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAttendance = await Attendance.findOne({
    tenantId,
    entityType,
    entityId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  if (existingAttendance) {
    const populatedAttendance = await Attendance.findById(existingAttendance._id)
      .populate("tenantId", "name")
      .populate("entityId");
    
    throw new apiError(400, "Attendance already marked for this date", populatedAttendance);
  }

  const attendance = new Attendance({
    tenantId,
    entityType,
    entityId,
    date: new Date(date),
    status: status || "PRESENT",
  });

  await attendance.save();

  const populatedAttendance = await Attendance.findById(attendance._id)
    .populate("tenantId", "name")
    .populate("entityId");

  return res
    .status(201)
    .json(new apiResponse(201, populatedAttendance, "Attendance marked successfully"));
});

// ✅ 2. Bulk mark attendance for students in a batch (Coaches/Club Admin)
export const bulkMarkStudentAttendance = asyncHandler(async (req, res) => {
  const { tenantId, batchId, date, attendances } = req.body;
  const user = req.user;

  if (user.role !== "COACH" && user.role !== "CLUB_ADMIN") {
    throw new apiError(403, "Only coaches and club admins can mark bulk attendance");
  }

  if (!attendances || !Array.isArray(attendances) || attendances.length === 0) {
    throw new apiError(400, "Attendances array is required and cannot be empty");
  }

  const attendanceRecords = attendances.map(({ studentId, status }) => ({
    tenantId,
    batchId,
    entityType: "student",
    entityId: studentId,
    date: new Date(date),
    status: status || "PRESENT",
  }));

  // ✅ Validate all ObjectIds
  const invalidIds = attendanceRecords.find(record => 
    !mongoose.Types.ObjectId.isValid(record.tenantId) || 
    !mongoose.Types.ObjectId.isValid(record.entityId)
  );
  if (invalidIds) {
    throw new apiError(400, "Invalid tenantId or studentId in attendances");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // ✅ Remove existing records for the date
  const studentIds = attendanceRecords.map(a => a.entityId);
  await Attendance.deleteMany({
    tenantId,
    entityType: "student",
    date: { $gte: startOfDay, $lt: endOfDay },
    entityId: { $in: studentIds },
  });

  // ✅ Insert new records
  const savedAttendances = await Attendance.insertMany(attendanceRecords);

  const populatedAttendances = await Attendance.find({
    _id: { $in: savedAttendances.map(a => a._id) },
  })
    .populate("tenantId", "name")
    .populate("entityId");

  return res.status(201).json(
    new apiResponse(
      201, 
      populatedAttendances, 
      `${savedAttendances.length} attendance records marked successfully`
    )
  );
});

// ✅ 3. Get attendance by date range (Coaches/Club Admin)
export const getAttendanceByDateRange = asyncHandler(async (req, res) => {
  const { tenantId, entityType, entityId, startDate, endDate } = req.query;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    throw new apiError(400, "Invalid tenantId");
  }

  let filter = { tenantId };

  // ✅ Role-based filtering
  if (user.role === "COACH") {
    filter.entityType = "student";
  }

  if (entityType) filter.entityType = entityType;
  if (entityId && mongoose.Types.ObjectId.isValid(entityId)) {
    filter.entityId = entityId;
  }

  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const attendances = await getAttendanceWithPopulation(filter);

  return res.status(200).json(
    new apiResponse(200, attendances, "Attendance fetched successfully", {
      count: attendances.length,
    })
  );
});

// ✅ 4. Get today's attendance (Coaches/Club Admin)
export const getTodayAttendance = asyncHandler(async (req, res) => {
  const { tenantId } = req.query;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    throw new apiError(400, "Invalid tenantId");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filter = {
    tenantId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  };

  // ✅ Role-based filtering
  if (user.role === "COACH") {
    filter.entityType = "student";
  }

  // ✅ Auto-mark coaches as PRESENT (for Club Admin view)
  if (user.role === "CLUB_ADMIN") {
    const coaches = await User.find(
      { role: "COACH", club: tenantId },
      "_id"
    );

    const coachIds = coaches.map(coach => coach._id);

    for (const coachId of coachIds) {
      const existing = await Attendance.findOne({
        tenantId,
        entityType: "coach",
        entityId: coachId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      if (!existing) {
        await Attendance.create({
          tenantId,
          entityType: "coach",
          entityId: coachId,
          date: today,
          status: "PRESENT",
        });
      }
    }
  }

  const attendances = await getAttendanceWithPopulation(filter);

  return res.status(200).json(
    new apiResponse(200, attendances, "Today's attendance fetched successfully", {
      date: today.toISOString().split("T")[0],
      count: attendances.length,
    })
  );
});

// ✅ 5. Update single attendance record
export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid attendance ID");
  }

  const attendance = await Attendance.findById(id).populate("entityId");

  if (!attendance) {
    throw new apiError(404, "Attendance record not found");
  }

  // ✅ Authorization checks
  if (attendance.entityType === "student") {
    if (user.role !== "COACH" && user.role !== "CLUB_ADMIN") {
      throw new apiError(403, "Only coaches and club admins can update student attendance");
    }
  } else if (attendance.entityType === "coach") {
    if (user.role !== "CLUB_ADMIN") {
      throw new apiError(403, "Only club admins can update coach attendance");
    }
  }

  if (status) {
    attendance.status = status;
  }

  await attendance.save();

  const populatedAttendance = await Attendance.findById(id)
    .populate("tenantId", "name")
    .populate("entityId");

  return res.status(200).json(
    new apiResponse(200, populatedAttendance, "Attendance updated successfully")
  );
});

// ✅ 6. Get attendance summary by batch/month (Coaches/Club Admin)
export const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { tenantId, batchId, month, year } = req.query;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    throw new apiError(400, "Invalid tenantId");
  }

  if (!month || !year) {
    throw new apiError(400, "Month and year are required");
  }

  const matchDate = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month, 0);

  let pipeline = [
    { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
    {
      $match: {
        date: {
          $gte: matchDate,
          $lte: nextMonth,
        },
      },
    },
    {
      $group: {
        _id: {
          entityId: "$entityId",
          entityType: "$entityType",
        },
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] },
        },
        absentDays: {
          $sum: { $cond: [{ $eq: ["$status", "ABSENT"] }, 1, 0] },
        },
        lateDays: {
          $sum: { $cond: [{ $eq: ["$status", "LATE"] }, 1, 0] },
        },
      },
    },
  ];

  if (batchId && mongoose.Types.ObjectId.isValid(batchId)) {
    pipeline.unshift({
      $match: {
        "entityId.batchId": new mongoose.Types.ObjectId(batchId),
      },
    });
  }

  const summary = await Attendance.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(200, summary, "Attendance summary fetched successfully", {
      period: `${month}/${year}`,
    })
  );
});

// ✅ 7. Get attendance report for specific entity
export const getEntityAttendanceReport = asyncHandler(async (req, res) => {
  const { entityId, entityType, startDate, endDate } = req.query;

  if (!entityId || !entityType || !startDate || !endDate) {
    throw new apiError(400, "entityId, entityType, startDate, and endDate are required");
  }

  if (!mongoose.Types.ObjectId.isValid(entityId)) {
    throw new apiError(400, "Invalid entityId");
  }

  const filter = {
    entityType,
    entityId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const attendances = await getAttendanceWithPopulation(filter);

  const totalDays = attendances.length;
  const presentDays = attendances.filter(a => a.status === "PRESENT").length;
  const attendancePercentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

  return res.status(200).json(
    new apiResponse(200, {
      attendances,
      summary: {
        totalDays,
        presentDays,
        absentDays: attendances.filter(a => a.status === "ABSENT").length,
        lateDays: attendances.filter(a => a.status === "LATE").length,
        attendancePercentage,
      },
    }, "Attendance report fetched successfully")
  );
});

export default {
  markAttendance,
  bulkMarkStudentAttendance,
  getAttendanceByDateRange,
  getTodayAttendance,
  updateAttendance,
  getAttendanceSummary,
  getEntityAttendanceReport,
};
