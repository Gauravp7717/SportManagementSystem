import {
  addTennant,
  createClubAdmin,
  getAllClubAdmins,
  getAllTennants,
} from "../controllers/superAdmin.controller.js";
import express from "express";

const adminRouter = express.Router();

// TODO: add middleware for superAdmin
adminRouter.post("/add-tennants", addTennant);
adminRouter.get("/all-tennants", getAllTennants);
adminRouter.post("/create-club-admin", createClubAdmin);
adminRouter.get("/all-admins", getAllClubAdmins);

export default adminRouter;
