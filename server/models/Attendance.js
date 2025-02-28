import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],  // Only these two values are allowed
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export { Attendance };  // Export Attendance model using ES6 syntax
