import Withdrawal from "../models/Withdrawal.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import AppError from "../utils/appError.js";

export const pendingWithdrawals = async (req, res, next) => {
  try {
    const items = await Withdrawal.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: { withdrawals: items } });
  } catch (err) {
    next(err);
  }
};

export const approveWithdrawal = async (req, res, next) => {
  try {
    const id = req.params.id;
    const w = await Withdrawal.findById(id);
    if (!w) return next(new AppError("Withdrawal not found", 404));
    if (w.status !== "pending")
      return next(new AppError("Withdrawal already processed", 400));
    // deduct coins from user at approval time
    const user = await User.findById(w.user);
    if (!user) return next(new AppError("User not found", 404));

    const deduct = Number(w.withdrawal_coin || 0);
    if ((user.coins || 0) < deduct)
      return next(
        new AppError("User has insufficient coins for this withdrawal", 400),
      );

    user.coins = (user.coins || 0) - deduct;
    await user.save();

    w.status = "approved";
    await w.save();

    res.status(200).json({ success: true, data: { withdrawal: w, user } });
  } catch (err) {
    next(err);
  }
};

export const rejectWithdrawal = async (req, res, next) => {
  try {
    const id = req.params.id;
    const w = await Withdrawal.findById(id);
    if (!w) return next(new AppError("Withdrawal not found", 404));
    if (w.status !== "pending")
      return next(new AppError("Withdrawal already processed", 400));
    // mark rejected; since we no longer deduct at creation, no refund needed
    w.status = "rejected";
    await w.save();

    res.status(200).json({ success: true, data: { withdrawal: w } });
  } catch (err) {
    next(err);
  }
};

export const adminStats = async (req, res, next) => {
  try {
    const totalWorkers = await User.countDocuments({ role: "worker" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });

    const coinsAgg = await User.aggregate([
      { $group: { _id: null, totalCoins: { $sum: "$coins" } } },
    ]);
    const totalCoins = coinsAgg[0]?.totalCoins || 0;

    const paymentsAgg = await Payment.aggregate([
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
    ]);
    const totalPayments = paymentsAgg[0]?.totalPaid || 0;

    res.status(200).json({
      success: true,
      data: { totalWorkers, totalBuyers, totalCoins, totalPayments },
    });
  } catch (err) {
    next(err);
  }
};

export default {};
