import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBatch,
  createSport,
  createStudent,
  deleteBatch,
  deleteSport,
  getSports,
  getBatches,
  getBatch,
  updateBatch,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
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

clubAdminRouter.post(
  "/create-batch",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  createBatch
);
clubAdminRouter.delete(
  "/delete-batch/:batchId",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  deleteBatch
);

clubAdminRouter.post(
  "/create-student",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  createStudent
);
// routes/clubAdmin.routes.js
clubAdminRouter.get(
  "/get-batches",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  getBatches
);

clubAdminRouter.get(
  "/get-batch/:batchId",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  getBatch
);

clubAdminRouter.put(
  "/update-batch/:batchId",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  updateBatch
);

clubAdminRouter.post("/", verifyJWT, authrizeRole("CLUB_ADMIN"), createStudent);
clubAdminRouter.put(
  "/update-student/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  updateStudent
); // ✅
clubAdminRouter.delete(
  "/delete-student/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  deleteStudent
); // ✅
clubAdminRouter.get("/get-student/:id", verifyJWT, authrizeRole("CLUB_ADMIN"), getStudent); // ✅
clubAdminRouter.get("/get-students", verifyJWT, authrizeRole("CLUB_ADMIN"), getStudents);

export default clubAdminRouter;
