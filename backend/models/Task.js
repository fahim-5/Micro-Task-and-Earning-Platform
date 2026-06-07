import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    detail: { type: String, trim: true },
    required_workers: { type: Number, required: true, default: 1 },
    required_workers_remaining: { type: Number, required: true, default: 1 },
    payable_amount: { type: Number, required: true, default: 0 },
    completion_date: { type: Date },
    submission_info: { type: String },
    task_image_url: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
