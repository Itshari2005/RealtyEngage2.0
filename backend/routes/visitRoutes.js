import express from "express";
import {
  createVisit,
  getMyVisits,
  getAllVisits,
  updateVisitStatus,
} from "../controllers/visitController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVisit);
router.get("/my", protect, getMyVisits);
router.get("/admin", protect, admin, getAllVisits);
router.put("/:id", protect, admin, updateVisitStatus);

export default router;
