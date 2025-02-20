import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("User");
  const [showPassword, setShowPassword] = useState(false);
  
  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Validation (same as before)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name must contain only alphabets and spaces");
      return;
    }
  
    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }
  
    if (!/^[A-Za-z ]+$/.test(city)) {
      toast.error("City must contain only alphabets and spaces");
      return;
    }
  
    const phoneNumberPattern = /^(9|8|7|6)\d{9}$/;
    if (!phoneNumberPattern.test(contact)) {
      toast.error("Phone number must start with 9, 8, 7, or 6 and contain exactly 10 digits");
      return;
    }
  
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        name,
        password,
        email,
        city,
        contact,
        role,
      });
  
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Something went wrong on the server");
      }
    } catch (error) {
      // Improved error handling
      
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "Server error occurred during registration"}`);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  


  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      offset: 120,
      once: true
    });
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='relative min-h-screen bg-cover bg-center' style={{ backgroundImage: 'url("https://img.freepik.com/free-photo/young-fitness-man-studio_7502-5008.jpg")' }}>
      <div className='absolute inset-0 bg-black opacity-50'></div> {/* Overlay for readability */}
      <div className='flex items-center justify-center min-h-screen px-6 relative'>
        <form
          className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg border-2 border-indigo-700 space-y-6'
          onSubmit={onSubmit}
          data-aos="fade-up"
        >
          <h2 className='text-center text-3xl text-gray-800 font-bold mb-8'>
            Create Your Account
          </h2>

          <Input
            type="text"
            placeholder="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength="4"
            maxLength="30"
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
            data-aos="zoom-in"
          />

          <Input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
            data-aos="zoom-in"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
              data-aos="zoom-in"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 text-lg"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <Input
            type="text"
            placeholder="City"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            minLength="4"
            maxLength="35"
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
            data-aos="zoom-in"
          />

          <Input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
            data-aos="zoom-in"
          />

          {/* <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            data-aos="zoom-in"
            className="p-4 w-full rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-indigo-600 hover:border-indigo-500 transition-all ease-in-out"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select> */}

          <Link to="/login" className='text-indigo-600 font-medium text-center block mb-6 transition-all duration-300 ease-in-out' data-aos="fade-in">
            Already have an account? <span className='underline'>Login</span>
          </Link>

          <button
            type='submit'
            className='w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:bg-gradient-to-l from-indigo-400 to-purple-500 transition-all ease-in-out'
            data-aos="slide-up"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
