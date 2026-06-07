import express from "express";
import {
  createWithdrawal,
  myWithdrawals,
} from "../controllers/withdrawalController.js";
import {
  pendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createWithdrawal);
router.get("/mine", protect, myWithdrawals);
// admin routes
router.get("/pending", protect, authorize("admin"), pendingWithdrawals);
router.post("/:id/approve", protect, authorize("admin"), approveWithdrawal);
router.post("/:id/reject", protect, authorize("admin"), rejectWithdrawal);

export default router;
