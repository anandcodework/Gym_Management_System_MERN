import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });
      
      // Check if the response is successful
      if (res && res.data.success) {
        const { token, user } = res.data;

        // Store the user and token in localStorage for persistent login
        localStorage.setItem('auth', JSON.stringify({ user, token }));

        // Update the global auth state using context
        setAuth({ user, token });
        navigate('/');
      } else {
        toast.error(res.data.message); // Show an error if login fails
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className='bg-cover bg-center' style={{ backgroundImage: 'url("https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg")' }}>
      <div className='container mx-auto px-6 py-16 flex items-center justify-center min-h-screen'>
        <form
          className='w-full max-w-md bg-white p-10 rounded-xl shadow-lg space-y-6 opacity-90'
          onSubmit={onSubmit}
          data-aos="fade-up" // Add AOS animation
        >
          <h2 className='text-center text-3xl text-gray-800 font-bold mb-6'>
            Login to Your Account
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
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Link
            to="/forgot-password"
            className='text-blue-600 font-medium hover:text-blue-800 transition-all duration-300 ease-in-out text-center block'
            data-aos="fade-in" // Add AOS animation
          >
            <span className='underline'>Forgot Password?</span>
          </Link>

          <button
            type='submit'
            className='w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:bg-gradient-to-l from-indigo-500 to-purple-500 transition-all ease-in-out'
            data-aos="slide-up" // Add AOS animation
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:text-blue-800 transition-all duration-300 ease-in-out">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
