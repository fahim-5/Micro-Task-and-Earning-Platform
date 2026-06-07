import Withdrawal from "../models/Withdrawal.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const createWithdrawal = async (req, res, next) => {
  try {
    const { withdrawalCoin, paymentSystem, accountNumber, details } = req.body;

    const coins = Number(withdrawalCoin || 0);
    if (!coins || coins <= 0)
      return next(new AppError("Invalid withdrawal coin amount", 400));

    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    // platform rule: user must have at least 200 coins in account to initiate withdrawals
    if ((user.coins || 0) < 200)
      return next(new AppError("Minimum 200 coins required to withdraw", 400));

    // requested coins must be available
    if ((user.coins || 0) < coins)
      return next(new AppError("Insufficient coins", 400));

    // enforce minimum per-request amount: at least 200 coins
    if (coins < 200)
      return next(new AppError("Withdrawal must be at least 200 coins", 400));

    // enforce multiples of 20 coins so dollar amount is whole number
    if (coins % 20 !== 0)
      return next(
        new AppError("Withdrawal coins must be a multiple of 20", 400),
      );

    // require payment details
    if (!paymentSystem)
      return next(new AppError("Payment system is required", 400));
    if (!accountNumber)
      return next(new AppError("Account number is required", 400));

    // convert coins to dollars: 20 coins = 1 dollar
    const withdrawalAmount = Number(coins) / 20;

    const w = await Withdrawal.create({
      user: user._id,
      worker_name: user.name,
      worker_email: user.email,
      withdrawal_coin: coins,
      withdrawal_amount: withdrawalAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      details,
      status: "pending",
    });
    res.status(201).json({ success: true, data: { withdrawal: w, user } });
  } catch (err) {
    next(err);
  }
};

export const myWithdrawals = async (req, res, next) => {
  try {
    const items = await Withdrawal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: { withdrawals: items } });
  } catch (err) {
    next(err);
  }
};

export default {};
