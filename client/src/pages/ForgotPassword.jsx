import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const submitPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/forgot-password`, {
        email,
        newPassword,
      });

      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({    
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      offset: 120, // Trigger animation before the element comes into view
      once: true 
    });
  }, []);

  return (
    <div className='bg-cover bg-center' style={{ backgroundImage: 'url("https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg")' }}>
      <div className='container mx-auto px-6 py-16 flex items-center justify-center min-h-screen'>
        <form
          className='w-full max-w-md bg-white p-10 rounded-xl shadow-lg space-y-6 opacity-90'
          onSubmit={submitPassword}
          data-aos="fade-up" // Add AOS animation
        >
          <h2 className='text-center text-3xl text-gray-800 font-bold mb-6'>
            Reset Your Password
          </h2>

          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
            className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
            data-aos="zoom-in" // Add AOS animation
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              name="newpassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ease-in-out"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:bg-gradient-to-l from-indigo-500 to-purple-500 transition-all ease-in-out"
            data-aos="slide-up" // Add AOS animation
          >
            Reset Password
          </button>

          <p className="text-center text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-300 ease-in-out">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
