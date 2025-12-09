import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  assignCoaches,
  assignStudents,
  createBatch,
  createSport,
  createStudent,
  deleteBatch,
  deleteSport,
  getSports,
} from "../controllers/clubAdmin.controller.js";
import { authrizeRole } from "../middlewares/role.middleware.js";

const clubAdminRouter = express.Router();

clubAdminRouter.post(
  "/create-sport",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  createSport
);
clubAdminRouter.get(
  "/get-sports",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  getSports
);
clubAdminRouter.delete(
  "/delete-sport/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  deleteSport
);

clubAdminRouter.post("/create-batch", verifyJWT, createBatch);
clubAdminRouter.delete("/delete-batch/:batchId", verifyJWT, deleteBatch);
clubAdminRouter.put("/assign-coaches/:batchId", verifyJWT, assignCoaches);
clubAdminRouter.put("/assign-students/:batchId", verifyJWT, assignStudents);

studentRouter.post("/create-student", verifyJWT, createStudent);

export default clubAdminRouter;
