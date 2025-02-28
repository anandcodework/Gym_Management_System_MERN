import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/fetchData';
import { Loader } from '../../components'; // Assuming you have a loader component
import toast from 'react-hot-toast';

const Attendance = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Present');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle form submission for attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', { name, status }); // Log the data being submitted
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/v1/attendance/attendance`, { name, status });
      toast.success('Attendance submitted!');
      fetchHistory(); // Refresh the attendance history after submission
    } catch (error) {
      toast.error('Error submitting attendance');
      console.error(error); // Log the error to see more details
    }
    setLoading(false);
  };

  // Fetch attendance history on component mount
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/attendance/attendanceHistory`);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(); // Fetch history when the component mounts
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className='pt-10 bg-gray-900 min-h-screen '>
      <div className="container mx-auto px-6 py-20 justify-items-center">
        <h2 className="text-3xl text-center text-white font-semibold mb-8">Attendance Management</h2>

        {/* Submit Attendance Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-1/2 justify-items-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 text-center">Submit Attendance</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
