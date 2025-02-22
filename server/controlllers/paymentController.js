import razorpayHelper from '../helpers/razorpayHelper.js'

const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;  
    const order = await razorpayHelper.createOrder(amount);
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating payment order' });
  }
};

export default {
  createPaymentOrder,
};
