import Razorpay from 'razorpay';

// Initialize Razorpay instance with keys from environment variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Use the RAZORPAY_KEY_ID from environment
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Use the RAZORPAY_KEY_SECRET from environment
});

// Create an order for payment
export const createOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay works in paise, so we multiply by 100)
      currency: 'INR',  // Currency for the payment
      receipt: `receipt_${Math.random() * 1000}`,  // Unique receipt number
      payment_capture: 1, // Automatically capture payment
    };

    // Create the order in Razorpay
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Error creating Razorpay order');
  }
};

export default {
  createOrder,
};
