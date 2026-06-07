import express from "express";
import {
  createTask,
  myTasks,
  updateTask,
  deleteTask,
  buyerStats,
  availableTasks,
  getTaskById,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/mine", protect, myTasks);
router.get("/available", availableTasks);
router.get("/:id", getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/stats", protect, buyerStats);

export default router;
