import {
  addTennant,
  createClubAdmin,
  getAllClubAdmins,
  getAllTennants,
} from "../controllers/superAdmin.controller.js";
import express from "express";
import { verifyJWT} from "../middlewares/auth.middleware.js";
import { authrizeRole } from "../middlewares/role.middleware.js";

const adminRouter = express.Router();

// TODO: add middleware for superAdmin
adminRouter.post(
  "/add-tennants",
  verifyJWT,
  authrizeRole("SUPER_ADMIN"),
  addTennant
);
adminRouter.get(
  "/all-tennants",
  verifyJWT,
  authrizeRole("SUPER_ADMIN"),
  getAllTennants
);
adminRouter.post(
  "/create-club-admin",
  verifyJWT,
  authrizeRole("SUPER_ADMIN"),
  createClubAdmin
);
adminRouter.get(
  "/all-admins",
  verifyJWT,
  authrizeRole("SUPER_ADMIN"),
  getAllClubAdmins
);

export default adminRouter;
