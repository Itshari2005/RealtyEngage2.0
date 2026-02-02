import express from "express";
import {
  addMaintenanceMember,
  getMaintenanceMembers,
  createMaintenanceRequest,
  getMaintenanceRequests,
} from "../controllers/maintenanceController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/member", protect, admin, addMaintenanceMember);
router.get("/requests", protect, admin, getMaintenanceRequests);

// Customer routes
router.get("/members", protect, getMaintenanceMembers);
router.post("/request", protect, createMaintenanceRequest);

export default router;
