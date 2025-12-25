// controllers/sport.controller.js (or add to your existing controller file)

import Tenant from "../models/tennants.model.js"; // adjust path if needed
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import Sport from "../models/Sport.model.js";
import Batch from "../models/Batch.model.js";
import Student from "../models/student.model.js";

const escapeRegExp = (string = "") =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// CREATE SPORT - tenant-scoped & secure
const createSport = asyncHandler(async (req, res) => {
  // // Basic auth check (verifyJWT middleware should populate req.user)
  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized");
  }

  const { sportName, description } = req.body;

  if (!sportName || typeof sportName !== "string" || !sportName.trim()) {
    throw new apiError(400, "sportName is required");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  console.log("tenant", tenant);

  if (!tenant) {
    // user is not a club admin (or tenant missing)
    throw new apiError(403, "Tenant not found or you don't have permissions");
  }

  const nameTrimmed = sportName.trim();

  console.log("sportName", sportName);

  const existing = await Sport.findOne({
    tenantId: tenant._id,
    sportName,
  });

  console.log("existing", existing);

  if (existing) {
    throw new apiError(409, "Sport already exists for this tenant");
  }

  // Create sport using your Sport schema fields (name, description, active)
  const sport = await Sport.create({
    tenantId: tenant._id,
    sportName: nameTrimmed,
    description: description ?? "",
  });

  return res
    .status(201)
    .json(new apiResponse(201, sport, "Sport created successfully"));
});

const getSports = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized");
  }

  // Find tenant for which this user is the clubAdmin
  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  if (!tenant) {
    throw new apiError(403, "Tenant not found or you don't have permissions");
  }

  const sports = await Sport.find({ tenantId: tenant._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new apiResponse(200, sports, "Sports fetched successfully"));
});

const deleteSport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized");
  }

  // Verify tenant ownership
  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  if (!tenant) {
    throw new apiError(403, "Tenant not found or you don't have permissions");
  }

  // Verify the sport belongs to this tenant
  const sport = await Sport.findOne({
    _id: id,
    tenantId: tenant._id,
  });

  if (!sport) {
    throw new apiError(404, "Sport not found or not authorized to delete");
  }

  await sport.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Sport deleted successfully"));
});

// controllers/clubAdmin.controller.js - FIXED createBatch only
const createBatch = asyncHandler(async (req, res) => {
  console.log("🔥 CREATE BATCH PAYLOAD:", req.body); // Debug

  const {
    batchStartTime,
    batchEndTime,
    sportId,
    coaches,
    students,
    schedule,
    batchName,
    capacity,
  } = req.body;

  // ✅ CRITICAL: Get tenantId from authenticated user
  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized - User not authenticated");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  // Validate required fields
  if (
    !batchStartTime ||
    !batchEndTime ||
    !sportId ||
    !Array.isArray(schedule) ||
    schedule.length === 0
  ) {
    console.log("❌ Validation failed:", {
      batchStartTime,
      batchEndTime,
      sportId,
      schedule,
    });
    throw new apiError(
      400,
      "batchStartTime, batchEndTime, sportId, and schedule (array) are required"
    );
  }

  if (!batchName || !capacity) {
    throw new apiError(400, "batchName and capacity are required");
  }

  // ✅ Verify sport belongs to this tenant
  const sportExist = await Sport.findOne({
    _id: sportId,
    tenantId: tenant._id,
  });
  if (!sportExist) {
    throw new apiError(
      404,
      "Sport not found or not authorized for this tenant"
    );
  }

  const batch = await Batch.create({
    tenantId: tenant._id, // ✅ REQUIRED by schema
    batchName,
    capacity: parseInt(capacity),
    batchStartTime,
    batchEndTime,
    sportId,
    coaches: coaches || [],
    students: students || [],
    schedule, // ✅ Now array
  });

  console.log("✅ Batch created:", batch._id);

  return res
    .status(201)
    .json(new apiResponse(201, batch, "Batch created successfully"));
});

const deleteBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  if (!batchId) {
    throw new apiError(400, "Batch id is required");
  }

  const deleted = await Batch.findByIdAndDelete(batchId);

  if (!deleted) {
    throw new apiError(404, "Batch not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, deleted, "Batch deleted successfully"));
});
// GET SINGLE BATCH (by id, tenant‑scoped)
const getBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  if (!batchId) {
    throw new apiError(400, "Batch id is required");
  }

  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized - User not authenticated");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const batch = await Batch.findOne({
    _id: batchId,
    tenantId: tenant._id,
  })
    .populate("sportId", "sportName")
    .populate("coaches", "fullname fullName name email")
    .populate("students", "name email contact");

  if (!batch) {
    throw new apiError(404, "Batch not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, batch, "Batch fetched successfully"));
});
// GET ALL BATCHES (for logged‑in tenant)
const getBatches = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized - User not authenticated");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const batches = await Batch.find({ tenantId: tenant._id })
    .populate("sportId", "sportName")
    .populate("coaches", "fullname fullName name email")
    .populate("students", "name email contact")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, batches, "Batches fetched successfully"));
});
// UPDATE BATCH (tenant‑scoped)
const updateBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const {
    batchName,
    capacity,
    batchStartTime,
    batchEndTime,
    sportId,
    coaches,
    students,
    schedule,
  } = req.body;

  if (!batchId) {
    throw new apiError(400, "Batch id is required");
  }

  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized - User not authenticated");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  // If sportId is being changed, verify it belongs to this tenant
  if (sportId) {
    const sportExist = await Sport.findOne({
      _id: sportId,
      tenantId: tenant._id,
    });
    if (!sportExist) {
      throw new apiError(
        404,
        "Sport not found or not authorized for this tenant"
      );
    }
  }

  if (schedule && (!Array.isArray(schedule) || schedule.length === 0)) {
    throw new apiError(400, "schedule must be a non-empty array if provided");
  }

  const updateData = {};
  if (batchName !== undefined) updateData.batchName = batchName.trim();
  if (capacity !== undefined) updateData.capacity = parseInt(capacity);
  if (batchStartTime !== undefined) updateData.batchStartTime = batchStartTime;
  if (batchEndTime !== undefined) updateData.batchEndTime = batchEndTime;
  if (sportId !== undefined) updateData.sportId = sportId;
  if (coaches !== undefined) updateData.coaches = coaches;
  if (students !== undefined) updateData.students = students;
  if (schedule !== undefined) updateData.schedule = schedule;

  const updatedBatch = await Batch.findOneAndUpdate(
    { _id: batchId, tenantId: tenant._id },
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("sportId", "sportName")
    .populate("coaches", "fullname fullName name email")
    .populate("students", "name email contact");

  if (!updatedBatch) {
    throw new apiError(404, "Batch not found or not authorized");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedBatch, "Batch updated successfully"));
});

const createStudent = asyncHandler(async (req, res) => {
  const { name, email, contact, dob, joiningDate, sports, feeStatus, batchId } =
    req.body;

  // In your controller, change this line:
  if (
    !name ||
    !dob ||
    !joiningDate ||
    !email ||
    !contact ||
    !batchId ||
    !sports
  ) {
    throw new apiError(
      400,
      "name, email, contact, dob, joiningDate, sports, and batchId are required"
    );
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const student = await Student.create({
    tenantId: tenant._id,
    name,
    email,
    contact,
    dob,
    joiningDate,
    sports,
    feeStatus,
    batchId,
  });

  return res
    .status(201)
    .json(new apiResponse(201, student, "Student created successfully"));
});

// ✅ UPDATE STUDENT
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, dob, joiningDate, sports, feeStatus, batchId } =
    req.body;

  // Validate required fields for update (allow partial updates)
  if (!id) {
    throw new apiError(400, "Student ID is required");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  // Find and update student
  const student = await Student.findOneAndUpdate(
    { _id: id, tenantId: tenant._id },
    {
      name,
      email,
      contact,
      dob,
      joiningDate,
      sports,
      feeStatus,
      batchId,
    },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new apiError(404, "Student not found or access denied");
  }

  return res
    .status(200)
    .json(new apiResponse(200, student, "Student updated successfully"));
});

// ✅ DELETE STUDENT
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Student ID is required");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const student = await Student.findOneAndDelete({
    _id: id,
    tenantId: tenant._id,
  });

  if (!student) {
    throw new apiError(404, "Student not found or access denied");
  }

  return res
    .status(200)
    .json(new apiResponse(200, student, "Student deleted successfully"));
});

// ✅ GET SINGLE STUDENT
const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Student ID is required");
  }

  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const student = await Student.findOne({ _id: id, tenantId: tenant._id })
    .populate("sports", "sportName")
    .populate("batchId", "name batchName");

  if (!student) {
    throw new apiError(404, "Student not found or access denied");
  }

  return res
    .status(200)
    .json(new apiResponse(200, student, "Student retrieved successfully"));
});

// ✅ GET ALL STUDENTS (TENANT-SCOPED)
const getStudents = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );
  if (!tenant) {
    throw new apiError(403, "Tenant not found or insufficient permissions");
  }

  const students = await Student.find({ tenantId: tenant._id })
    .populate("sports", "sportName")
    .populate("batchId", "name batchName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, students, "Students retrieved successfully"));
});

export {
  createBatch,
  deleteBatch,
  deleteSport,
  getSports,
  createSport,
  createStudent,
  updateStudent, // ✅ NEW
  deleteStudent, // ✅ NEW
  getStudent, // ✅ NEW
  getStudents, // ✅ NEW (renamed from getStudents to match your frontend)
  getBatches,
  getBatch,
  updateBatch,
};
