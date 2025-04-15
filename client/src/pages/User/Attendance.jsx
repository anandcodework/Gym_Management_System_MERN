import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/fetchData';
import { Loader } from '../../components';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Attendance = () => {
  const { auth } = useAuth();
  const [status, setStatus] = useState('Present');
  const [name, setName] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setName(auth.user.name);
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/api/v1/attendance/attendance`,
        {
          name,
          status
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Attendance submitted!');
      fetchHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error submitting attendance'
      );
      console.error(error);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const userName = auth?.user?.name;
      if (!userName) {
        toast.error('User not authenticated.');
        setLoading(false);
        return;
      }
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
    fetchHistory();
  }, []);

  if (loading) return <Loader />;

  const getDayStatus = (date) => {
    const record = history.find(
      (item) =>
        new Date(item.date).toLocaleDateString() ===
        date.toLocaleDateString()
    );
    return record ? record.status : null;
  };

  return (
    <section className="pt-10 bg-gray-900 min-h-screen px-4">
      <div className="max-w-7xl mx-auto py-10">
        <h2 className="text-3xl md:text-4xl text-center text-white font-bold mb-12">
          Attendance Management
        </h2>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-10">
          {/* Submit Attendance */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-xl mx-auto">
            <h3 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
              Submit Attendance
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Name: <span className="font-semibold">{name}</span>
                </p>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              >
                Submit Attendance
              </button>
            </form>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-xl mx-auto">
            <h3 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
              Attendance Calendar
            </h3>
            <div className="text-center flex justify-center">
              <Calendar
                tileClassName={({ date }) => {
                  const status = getDayStatus(date);
                  if (status === 'Present') return 'bg-green-500 text-white rounded-md';
                  if (status === 'Absent') return 'bg-red-500 text-white rounded-md';
                  return '';
                }}
                onClickDay={(value) => console.log(value)}
              />
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto mt-12">
          <h3 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
            Attendance History
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-gray-500">
                No attendance records found.
              </p>
            ) : (
              history.map((record) => (
                <div
                  key={record._id}
                  className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <span className="text-gray-800 font-medium">{record.name}</span>
                  <span
                    className={`font-medium ${
                      record.status === 'Present'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {record.status}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
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
