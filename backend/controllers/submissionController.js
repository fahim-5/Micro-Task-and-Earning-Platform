import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const submissionsForTaskOwner = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) return next(new AppError("Task not found", 404));
    if (String(task.owner) !== String(req.user.id))
      return next(new AppError("Not authorized", 403));

    const submissions = await Submission.find({
      task: taskId,
      status: "pending",
    }).populate("worker", "name email avatar coins");
    res.status(200).json({ success: true, data: { submissions } });
  } catch (err) {
    next(err);
  }
};

export const submissionsForOwner = async (req, res, next) => {
  try {
    // find submissions for tasks that belong to this owner
    const subs = await Submission.find({ status: "pending" }).populate("task");
    const ownerSubs = subs.filter(
      (s) => String(s.task.owner) === String(req.user.id),
    );
    res.status(200).json({ success: true, data: { submissions: ownerSubs } });
  } catch (err) {
    next(err);
  }
};

// worker: get own submissions
export const mySubmissions = async (req, res, next) => {
  try {
    const subs = await Submission.find({ worker: req.user.id }).populate(
      "task",
    );
    res.status(200).json({ success: true, data: { submissions: subs } });
  } catch (err) {
    next(err);
  }
};

// worker: create a submission for a task
export const createSubmission = async (req, res, next) => {
  try {
    const { taskId, content } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return next(new AppError("Task not found", 404));
    if ((task.required_workers_remaining || 0) <= 0)
      return next(new AppError("No remaining slots for this task", 400));

    const worker = await User.findById(req.user.id);
    if (!worker) return next(new AppError("User not found", 404));

    const buyer = await User.findById(task.owner);

    const sub = await Submission.create({
      task: task._id,
      worker: worker._id,
      worker_name: worker.name,
      worker_email: worker.email,
      task_title: task.title,
      payable_amount: task.payable_amount,
      content,
      buyer_name: buyer?.name,
      buyer_email: buyer?.email,
      status: "pending",
    });

    // reserve a slot
    task.required_workers_remaining =
      (task.required_workers_remaining || 0) - 1;
    await task.save();

    res.status(201).json({ success: true, data: { submission: sub } });
  } catch (err) {
    next(err);
  }
};

export const approveSubmission = async (req, res, next) => {
  try {
    const sub = await Submission.findById(req.params.id).populate("worker");
    if (!sub) return next(new AppError("Submission not found", 404));

    const task = await Task.findById(sub.task);
    if (!task) return next(new AppError("Task not found", 404));
    if (String(task.owner) !== String(req.user.id))
      return next(new AppError("Not authorized", 403));

    if (sub.status !== "pending")
      return next(new AppError("Submission already processed", 400));

    // pay worker
    const worker = await User.findById(sub.worker._id);
    worker.coins = (worker.coins || 0) + Number(sub.payable_amount);
    await worker.save();

    sub.status = "approved";
    await sub.save();

    // note: slot was reserved at submission time, so no change here

    res.status(200).json({ success: true, data: { submission: sub } });
  } catch (err) {
    next(err);
  }
};

export const rejectSubmission = async (req, res, next) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return next(new AppError("Submission not found", 404));

    const task = await Task.findById(sub.task);
    if (!task) return next(new AppError("Task not found", 404));
    if (String(task.owner) !== String(req.user.id))
      return next(new AppError("Not authorized", 403));

    if (sub.status !== "pending")
      return next(new AppError("Submission already processed", 400));

    sub.status = "rejected";
    await sub.save();

    // increase required_workers_remaining by 1
    task.required_workers_remaining =
      (task.required_workers_remaining || 0) + 1;
    await task.save();

    res.status(200).json({ success: true, data: { submission: sub } });
  } catch (err) {
    next(err);
  }
};

export default {};
