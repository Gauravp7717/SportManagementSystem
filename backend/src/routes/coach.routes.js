import express from "express";
import {
  createCoach,
  getAllCoaches,
  getCoach,
  updateCoach,
  deleteCoach,
} from "../controllers/coach.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authrizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// ›› Club Admin & Super Admin can manage coaches
router.post(
  "/create-coach",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  createCoach
);

router.get(
  "/get-all-coaches",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  getAllCoaches
);

router.get("/get-coach/:id", verifyJWT, authrizeRole("CLUB_ADMIN"), getCoach);

router.put(
  "/update-coach/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  updateCoach
);

router.delete(
  "/delete-coach/:id",
  verifyJWT,
  authrizeRole("CLUB_ADMIN"),
  deleteCoach
);

export default router;
