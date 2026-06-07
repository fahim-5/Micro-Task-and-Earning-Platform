import express from "express";
import {
  submissionsForTaskOwner,
  approveSubmission,
  rejectSubmission,
  submissionsForOwner,
  mySubmissions,
  createSubmission,
} from "../controllers/submissionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/task/:taskId", protect, submissionsForTaskOwner);
router.get("/owner/pending", protect, submissionsForOwner);
router.get("/mine", protect, mySubmissions);
router.post("/", protect, createSubmission);
router.post("/:id/approve", protect, approveSubmission);
router.post("/:id/reject", protect, rejectSubmission);

export default router;
