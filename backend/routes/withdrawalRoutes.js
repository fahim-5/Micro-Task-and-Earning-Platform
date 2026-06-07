import express from "express";
import {
  createWithdrawal,
  myWithdrawals,
} from "../controllers/withdrawalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createWithdrawal);
router.get("/mine", protect, myWithdrawals);

export default router;
