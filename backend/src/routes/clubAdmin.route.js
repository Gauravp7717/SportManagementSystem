import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSport,
  deleteSport,
  getSports,
} from "../controllers/clubAdmin.controller.js";

const clubAdminRouter = express.Router();

clubAdminRouter.post("/create-sport", verifyJWT, createSport);
clubAdminRouter.get("/get-sports", verifyJWT, getSports);
clubAdminRouter.delete("/delete-sport/:id", verifyJWT, deleteSport);

export default clubAdminRouter;
