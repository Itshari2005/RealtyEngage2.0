import express from "express";
import {
  reserveToken,
  getMyPayments,
  getAllPayments,
  createEMIPlan,
  requestPayment,
  settleFullPayment,
  approvePayment
} from "../controllers/paymentController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reserve", protect, reserveToken);
router.get("/my", protect, getMyPayments);
router.get("/admin", protect, admin, getAllPayments);
router.post("/emi", protect, createEMIPlan);
router.post("/request", protect, requestPayment);
router.put("/approve", protect, admin, approvePayment);
router.put("/settle", protect, settleFullPayment);


export default router;
