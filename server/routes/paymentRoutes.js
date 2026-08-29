import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay/create-order", protect, createRazorpayOrder);
paymentRouter.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default paymentRouter;