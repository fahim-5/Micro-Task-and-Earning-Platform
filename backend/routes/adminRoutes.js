import express from "express";
import { adminStats } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), adminStats);

export default router;
