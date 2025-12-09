import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSport,
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

export default clubAdminRouter;
