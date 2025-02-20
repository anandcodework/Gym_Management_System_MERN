import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Input, ButtonOutline, Loader } from '../components';
import { useAuth } from '../context/auth';
import { FiArrowUpRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { BASE_URL } from '../utils/fetchData';

const PlanSelection = () => {
  const { planid } = useParams();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(auth?.user?.name);
  const [planName, setPlanName] = useState("");
  const [planAmount, setPlanAmount] = useState(0);
  const [monthlyPlanAmount, setMonthlyPlanAmount] = useState("");
  const [yearlyPlanAmount, setYearlyPlanAmount] = useState("");
  const [planType, setPlanType] = useState("");
  const [planId, setPlanId] = useState(planid);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // State to track payment method
  const [showPaymentGateway, setShowPaymentGateway] = useState(false); // State to show/hide payment gateway options

  const getPlan = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/plan/get-plan/${planid}`);
      if (res.data && res.data.success) {
        setPlanName(res.data.plan.planName);
        setMonthlyPlanAmount(res.data.plan.monthlyPlanAmount);
        setYearlyPlanAmount(res.data.plan.yearlyPlanAmount);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong in getting subscription");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    getPlan();
  }, [planid]);

  const calculatePlanAmount = (planType) => {
    if (planType === "1 Month") {
      return monthlyPlanAmount;
    } else if (planType === "3 Month") {
      return monthlyPlanAmount * 3;
    } else if (planType === "6 Month") {
      return monthlyPlanAmount * 6;
    } else if (planType === "9 Month") {
      return monthlyPlanAmount * 9;
    } else if (planType === "1 Year") {
      return yearlyPlanAmount || monthlyPlanAmount * 12;
    }
    return 0;
  };

  const handleDurationChange = (planType) => {
    setPlanType(planType);
    const amount = calculatePlanAmount(planType);
    setPlanAmount(amount);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) {
      toast.error("You are not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    setShowPaymentGateway(true); // Show payment gateway options after form submit
  };

  // Handle payment method selection
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setShowPaymentGateway(false); // Close the payment gateway options after selection
    toast.success(`Selected ${method} payment method.`);
    
    if (method === 'Cash') {
      // If Cash, directly proceed with the subscription
      completeSubscription();
    } else if (method === 'Online') {
      // If Online, trigger Razorpay API for payment
      initiateRazorpayPayment();
    }
  };

  const completeSubscription = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/subscription/create-subscription`, {
        userName, planType, planAmount, planId
      }, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      });

      if (res.data && res.data.success) {
        toast.success(res.data.message);
        navigate("/"); // Redirect on success
      } else {
        toast.error(res.data.message || "Failed to create subscription");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error(error);
        toast.error("Something went wrong while creating subscription");
      }
    }
  };

  const initiateRazorpayPayment = async () => {
    // Razorpay API Integration code here
    try {
      const paymentData = await axios.post(`${BASE_URL}/api/v1/payment/razorpay`, {
        amount: planAmount,
      });

      const options = {
        key: paymentData.data.key,
        amount: paymentData.data.amount,
        currency: paymentData.data.currency,
        order_id: paymentData.data.order_id,
        handler: async (response) => {
          // Handle successful payment and complete subscription
          try {
            const res = await axios.post(`${BASE_URL}/api/v1/subscription/create-subscription`, {
              userName, planType, planAmount, planId
            }, {
              headers: {
                Authorization: `Bearer ${auth?.token}`
              }
            });

            if (res.data && res.data.success) {
              toast.success(res.data.message);
              navigate("/"); // Redirect on success
            } else {
              toast.error(res.data.message || "Failed to create subscription");
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong while completing payment");
          }
        },
        prefill: {
          name: userName,
          email: auth?.user?.email,
        },
        notes: {
          planType: planType,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Error initiating Razorpay payment.");
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-900">
      <div className="container mx-auto px-6">
        <form className="flex w-full h-screen justify-center items-center flex-col gap-5" onSubmit={onSubmit}>
          <h2 className="text-center text-4xl text-white font-bold">Choose Plan</h2>

          <Input
            type="text"
            placeholder="User Name"
            name="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            pattern="[A-Za-z ]+"
            minLength="4"
            maxLength="30"
          />

          <Input
            type="text"
            placeholder="Plan Name"
            name="planname"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />

          <select
            value={planType}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="w-full max-w-[750px] px-7 py-3 rounded-md border-none outline-none bg-white placeholder:text-gray-600 placeholder:font-bold font-medium"
          >
            <option value="">Select Duration</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Month">3 Month</option>
            <option value="6 Month">6 Month</option>
            <option value="9 Month">9 Month</option>
            <option value="1 Year">1 Year</option>
          </select>

          <Input
            type="text"
            placeholder="Plan Amount"
            name="planamount"
            value={planAmount}
            onChange={(e) => setPlanAmount(e.target.value)}
            disabled
          />

          <button type="submit" className="btn px-5 py-2 font-normal outline-none border border-white rounded-sm text-xl text-white hover:text-black hover:bg-white transition-all ease-in w-full max-w-[750px]">
            Submit
          </button>
        </form>
      </div>

      {showPaymentGateway && (
        <div className="payment-gateway-modal bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl text-center font-semibold mb-4">Select Payment Method</h3>
            <div className="flex justify-center gap-5">
              <button
                className="btn bg-green-500 text-white py-2 px-6 rounded-md"
                onClick={() => handlePaymentMethod('Cash')}
              >
                Cash
              </button>
              <button
                className="btn bg-blue-500 text-white py-2 px-6 rounded-md"
                onClick={() => handlePaymentMethod('Online')}
              >
                Online
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlanSelection;
