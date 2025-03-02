import { Attendance } from '../models/Attendance.js';  // Import Attendance model

// Submit Attendance
export const submitAttendance = async (req, res) => {
  try {
    const { name, status } = req.body; // Get data from the request body

    if (!name || !status) {
      return res.status(400).json({ message: 'Student name and status are required' });
    }

    // Get today's date (we only care about the year, month, and day)
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if attendance already exists for today
    const existingAttendance = await Attendance.findOne({
      name,
      date: { $gte: new Date(dateString), $lt: new Date(today.setDate(today.getDate() + 1)) }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance for today has already been submitted.' });
    }

    // Create new attendance record
    const newAttendance = new Attendance({ name, status });
    await newAttendance.save();  // Save to MongoDB

    res.status(201).json({ message: 'Attendance submitted successfully' });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({ message: 'Error submitting attendance', error: error.message });
  }
};

// Get Attendance History
export const getAllHistory = async (req, res) => {
  try {
    const history = await Attendance.find().sort({ date: -1 }); // Get sorted history
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Error fetching attendance history', error: error.message });
  }
};

// Get User's Attendance History
export const getUserHistory = async (req, res) => {
  const { name } = req.query;  // Extract the name from query parameters

  try {
    // Fetch the attendance records for the specific user by name
    const userAttendanceHistory = await Attendance.find({ name }).sort({ date: -1 });

    if (userAttendanceHistory.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this user.' });
    }

    res.status(200).json(userAttendanceHistory);
  } catch (error) {
    console.error('Error fetching user attendance history:', error);
    res.status(500).json({ message: 'Error fetching attendance history', error: error.message });
  }
};
