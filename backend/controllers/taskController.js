import Task from "../models/Task.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import AppError from "../utils/appError.js";

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
    } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    const totalPayable = Number(required_workers) * Number(payable_amount);
    if (user.coins < totalPayable)
      return next(new AppError("Not enough coins", 400));

    // deduct coins
    user.coins = user.coins - totalPayable;
    await user.save();

    const task = await Task.create({
      title,
      detail,
      required_workers,
      required_workers_remaining: required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
      owner: user._id,
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

export const myTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: { tasks } });
  } catch (err) {
    next(err);
  }
};

export const availableTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ required_workers_remaining: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .populate("owner", "name email");
    res.status(200).json({ success: true, data: { tasks } });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "owner",
      "name email",
    );
    if (!task) return next(new AppError("Task not found", 404));
    res.status(200).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError("Task not found", 404));
    if (String(task.owner) !== String(req.user.id))
      return next(new AppError("Not authorized", 403));

    const allowed = [
      "title",
      "detail",
      "submission_info",
      "task_image_url",
      "completion_date",
    ];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) task[k] = req.body[k];
    });
    await task.save();
    res.status(200).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new AppError("Task not found", 404));
    // allow owner or admin to delete
    if (String(task.owner) !== String(req.user.id) && req.user.role !== "admin")
      return next(new AppError("Not authorized", 403));

    // refund remaining amount
    const refund =
      Number(task.required_workers_remaining) * Number(task.payable_amount);
    const user = await User.findById(req.user.id);
    user.coins = (user.coins || 0) + refund;
    await user.save();

    await task.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

export const allTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate("owner", "name email");
    res.status(200).json({ success: true, data: { tasks } });
  } catch (err) {
    next(err);
  }
};

export const buyerStats = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    const totalCount = tasks.length;
    const pendingTaskSum = tasks.reduce(
      (acc, t) => acc + (t.required_workers_remaining || 0),
      0,
    );
    // sum payments made by this user
    const payments = await Payment.find({ user: req.user.id });
    const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: { totalCount, pendingTaskSum, totalPaid },
    });
  } catch (err) {
    next(err);
  }
};

export default {};
