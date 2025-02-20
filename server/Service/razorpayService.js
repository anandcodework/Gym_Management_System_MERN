
const razorpayHelper = require('../helpers/razorpayHelper');
const Order = require('../models/orderModel');

exports.createRazorpayOrder = async (amount) => {
  try {
    const order = await razorpayHelper.createOrder(amount);
    // Optionally, save order details to database
    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
    await newOrder.save();
    return order;
  } catch (error) {
    throw new Error('Error in Razorpay service');
  }
};
