import Payment from "../models/Payment.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const purchaseCoins = async (req, res, next) => {
  try {
    const { coins, amount, provider = "dummy" } = req.body;
    if (!coins || !amount)
      return next(new AppError("Invalid payment data", 400));
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    user.coins = (user.coins || 0) + Number(coins);
    await user.save();

    const payment = await Payment.create({
      user: user._id,
      amount,
      coins,
      provider,
      status: "completed",
    });

    res.status(201).json({ success: true, data: { payment, user } });
  } catch (err) {
    next(err);
  }
};

export const myPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: { payments } });
  } catch (err) {
    next(err);
  }
};

export default {};
