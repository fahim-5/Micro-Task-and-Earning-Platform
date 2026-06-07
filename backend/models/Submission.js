import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker_name: { type: String },
    worker_email: { type: String },
    buyer_name: { type: String },
    buyer_email: { type: String },
    task_title: { type: String },
    payable_amount: { type: Number, required: true },
    content: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
