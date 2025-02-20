// routes/paymentRoutes.js
import express from 'express';
import paymentController from '../controlllers/paymentController.js';

const router = express.Router();

// Define the routes
router.post('/create-order', paymentController.createPaymentOrder);

export default router; // Use default export here
