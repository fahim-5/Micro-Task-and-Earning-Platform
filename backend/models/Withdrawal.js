import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker_name: { type: String },
    worker_email: { type: String },
    withdrawal_coin: { type: Number, required: true },
    withdrawal_amount: { type: Number, required: true }, // in dollars
    payment_system: { type: String },
    account_number: { type: String },
    status: {
      type: String,
      enum: ["pending", "processed", "rejected"],
      default: "pending",
    },
    details: { type: String },
  },
  { timestamps: true },
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
