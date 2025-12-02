// controllers/sport.controller.js (or add to your existing controller file)

import Tenant from "../models/tennants.model.js"; // adjust path if needed
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import Sport from "../models/Sport.model.js";

const escapeRegExp = (string = "") =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// CREATE SPORT - tenant-scoped & secure
export const createSport = asyncHandler(async (req, res) => {
  // Basic auth check (verifyJWT middleware should populate req.user)
  if (!req.user || !req.user._id) {
    throw new apiError(401, "Unauthorized");
  }

  const { sportName, description, status } = req.body;

  // if (!sportName || typeof sportName !== "string" || !sportName.trim()) {
  //   throw new apiError(400, "sportName is required");
  // }

  // Find the tenant for which this user is the clubAdmin
  const tenant = await Tenant.findOne({ clubAdmin: req.user._id }).select(
    "_id"
  );

  if (!tenant) {
    // user is not a club admin (or tenant missing)
    throw new apiError(403, "Tenant not found or you don't have permissions");
  }

  const nameTrimmed = sportName.trim();

  // Prevent duplicates inside the same tenant (case-insensitive)
  const regex = new RegExp(`^${escapeRegExp(nameTrimmed)}$`, "i");
  const existing = await Sport.findOne({
    tenantId: tenant._id,
    sportName: { $regex: regex },
  });

  if (existing) {
    throw new apiError(409, "Sport already exists for this tenant");
  }

  // Create sport using your Sport schema fields (name, description, active)
  const sport = await Sport.create({
    tenantId: tenant._id,
    sportName: nameTrimmed,
    description: description ?? "",
    active: status === undefined ? true : Boolean(status),
  });

  return res
    .status(201)
    .json(new apiResponse(201, sport, "Sport created successfully"));
});

export const getSports = asyncHandler(async (req, res) => {
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

export const deleteSport = asyncHandler(async (req, res) => {
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
