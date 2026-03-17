import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleWishlist,
  getWishlist,
} from "../controllers/projectController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

// Wishlist routes 
router.get("/my-wishlist", protect, getWishlist);
router.post("/wishlist-toggle/:id", protect, toggleWishlist);

// Dynamic routes
router.get("/:id", getProjectById);

// Admin routes
router.post("/", protect, admin, createProject);
router.put("/:id", protect, admin, updateProject);
router.delete("/:id", protect, admin, deleteProject);

export default router;
