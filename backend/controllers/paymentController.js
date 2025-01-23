import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import Payment from "../models/Payment.js";

dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: Number(Number(amount) * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ data: order });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error !", error: err });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    // Condition
    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Save Payment
      await payment.save();

      // Send Message
      res.status(200).json({
        message: "Payement Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! ", error: error });
  }
});

export default router;
