import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/fetchData';
import { Loader } from '../../components'; // Assuming you have a loader component
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles

const Attendance = () => {
  const { auth } = useAuth();
  const [status, setStatus] = useState('Present');
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load initial user data when the component mounts
  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name);  // Set name from auth context
    }
  }, [auth]);

  // Handle form submission for attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Send the data to the backend with JSON format
      const response = await axios.post(
        `${BASE_URL}/api/v1/attendance/attendance`, 
        { 
          name: name, // Send the user name
          status: status // Send the attendance status (Present/Absent)
        },
        {
          headers: {
            'Content-Type': 'application/json', // Specify content type as JSON
          }
        }
      );

      toast.success('Attendance submitted!');
      fetchHistory(); // Refresh the attendance history after successful submission
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || 'Error submitting attendance');
      } else {
        toast.error('Error submitting attendance');
      }
      console.error(error);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
  
      // Use `auth.user.name` or `auth.user._id` depending on what you have in your auth context
      const userName = auth?.user?.name;
  
      if (!userName) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
  
      // Send the username in the request to filter the history
      const response = await axios.get(
        `${BASE_URL}/api/v1/attendance/user-history?name=${userName}`
      );
  
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      toast.error('Error fetching attendance history');
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchHistory(); // Fetch history when the component mounts
  }, []);

  if (loading) {
    return <Loader />; // Show loader while data is being fetched or submitted
  }

  // Map attendance history to a format the calendar can use
  const markDates = () => {
    return history.map((record) => {
      return {
        date: new Date(record.date),
        status: record.status,
      };
    });
  };

  // Format dates into a dictionary of statuses
  const getDayStatus = (date) => {
    const record = history.find(
      (item) => new Date(item.date).toLocaleDateString() === date.toLocaleDateString()
    );
    return record ? record.status : null;
  };

  return (
    <section className='pt-10 bg-gray-900 min-h-screen'>
      <div className="container mx-auto px-6 py-20 justify-items-center">
        <h2 className="text-3xl text-center text-white font-semibold mb-8">Attendance Management</h2>

        {/* Submit Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-1/2 justify-items-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Submit Attendance</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className='fontsemi-bold text-2xl '>Name: {name}</p>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Submit Attendance
            </button>
          </form>
        </div>

        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/2 mb-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Attendance Calendar</h3>
          <div className="text-center flex justify-center">
            <Calendar
              tileClassName={({ date }) => {
                const status = getDayStatus(date);
                if (status === 'Present') {
                  return 'bg-green-500 text-white'; // Green for present
                }
                if (status === 'Absent') {
                  return 'bg-red-500 text-white'; // Red for absent
                }
                return ''; // Default tile class if no attendance data
              }}
              onClickDay={(value) => console.log(value)} // Optional: Handle day click
            />
          </div>
        </div>

        {/* Attendance History Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Attendance History</h3>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-gray-500">No attendance records found.</p>
            ) : (
              history.map((record) => (
                <div key={record._id} className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{record.name}</span>
                  <span className={`font-medium ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.status}
                  </span>
                  <span className="text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Attendance;
