import express from "express";
import {
  createTask,
  myTasks,
  updateTask,
  deleteTask,
  buyerStats,
  availableTasks,
  getTaskById,
  allTasks,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/mine", protect, myTasks);
router.get("/available", availableTasks);
router.get("/all", protect, authorize("admin"), allTasks);
router.get("/stats", protect, buyerStats);
router.get("/:id", getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
