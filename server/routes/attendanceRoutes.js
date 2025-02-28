import express from 'express';
import { submitAttendance, getAttendanceHistory } from '../controlllers/attendanceController.js';

const router = express.Router();

// POST - Submit attendance
router.post('/attendance', submitAttendance);

// GET - Get attendance history
router.get('/attendanceHistory', getAttendanceHistory);

export default router;  // Use ES6 export
