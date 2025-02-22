// routes/paymentRoutes.js
import express from 'express';
import paymentController from '../controlllers/paymentController.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/create-order', paymentController.createPaymentOrder);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order route
router.post('/razorpay', async (req, res) => {
  const { amount } = req.body;  // Expect the amount from frontend

  const orderOptions = {
    amount: amount * 100, // Convert amount to paise (Razorpay accepts amount in paise)
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
    payment_capture: 1, // Auto capture payment
  };

  try {
    const order = await razorpay.orders.create(orderOptions);
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
    });
  } catch (error) {
    console.error('Error creating Razorpay order', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
