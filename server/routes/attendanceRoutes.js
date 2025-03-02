import express from 'express';
import { submitAttendance, getAllHistory, getUserHistory } from '../controlllers/attendanceController.js';

const router = express.Router();

// POST - Submit attendance
router.post('/attendance', submitAttendance);

// GET - Get attendance history
router.get('/user-history', getUserHistory);

// GET - Get all attendance history (admin or other use cases)
router.get('/all-history', getAllHistory);

export default router;
