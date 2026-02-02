import express from "express";
import {
  reserveToken,
  getMyPayments,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveToken);
router.get("/my", protect, getMyPayments);
router.get("/admin", protect, admin, getAllPayments);

export default router;
