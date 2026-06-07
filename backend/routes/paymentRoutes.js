import express from "express";
import { purchaseCoins, myPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/purchase", protect, purchaseCoins);
router.get("/mine", protect, myPayments);

export default router;
