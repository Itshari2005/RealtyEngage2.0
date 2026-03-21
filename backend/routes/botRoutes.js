import express from "express";
import { chatWithBot } from "../controllers/botController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chat", protect, chatWithBot);

export default router;