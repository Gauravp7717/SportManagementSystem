import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import User from "../models/User.model.js";

// ➜ Create Coach
export const createCoach = asyncHandler(async (req, res) => {
  const { username, password, fullname, salary } = req.body;

  if (!username || !password || !salary || !fullname) {
    throw new apiError(400, "All fields are required");
  }

  // Check if username already exists
  const existingCoach = await User.findOne({ username });
  if (existingCoach) {
    throw new apiError(409, "Coach username already exists");
  }

  const coach = await User.create({
    username: username.toLowerCase(),
    password,
    fullname,
    salary,
    role: "COACH",
  });

  const createdCoach = await User.findById(coach._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new apiResponse(201,  { 
        coach: createdCoach,
        password: password  // send original password here
      }, "Coach created successfully"));
});

// ➜ Get All Coaches
export const getAllCoaches = asyncHandler(async (req, res) => {
  const coaches = await User.find({ role: "COACH" }).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new apiResponse(200, coaches, "Coaches fetched successfully"));
});

// ➜ Get Single Coach
export const getCoach = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coach = await User.findById(id).select("-password -refreshToken");
  if (!coach) {
    throw new apiError(404, "Coach not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, coach, "Coach fetched successfully"));
});

// ➜ Update Coach
export const updateCoach = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullname,salary, password } = req.body;

  const coach = await User.findById(id);
  if (!coach || coach.role !== "COACH") {
    throw new apiError(404, "Coach not found");
  }

  if (fullname) coach.fullname = fullname;
  if (password) coach.password = password;
  if (salary) coach.salary = salary;

  await coach.save({ validateBeforeSave: false });

  const updatedCoach = await User.findById(id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedCoach, "Coach updated successfully"));
});

// ➜ Delete Coach
export const deleteCoach = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coach = await User.findById(id);
  if (!coach || coach.role !== "COACH") {
    throw new apiError(404, "Coach not found");
  }

  await User.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Coach deleted successfully"));
});
