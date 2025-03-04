import express from 'express';
// import { requireSignIn } from '../Middlewares/authMiddleware.js';
import JWT from "jsonwebtoken";
import {
  getAllFeedbacks,
  createFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  feedbackCountController
} from "../controlllers/feedbackController.js";


// Middleware to check if user is signed in
const requireSignIn = async (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers.authorization);
        const decode = JWT.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        console.log("Decoded Token:", decode);
        req.user = decode;  // Set the decoded token in req.user
        next();
    } catch (err) {
        console.log("Error:", err);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};


const router = express.Router();

// POST - Create Feedback
router.post('/create-feedback', requireSignIn, createFeedback);

// GET - Get all Feedbacks
router.get('/getall-feedback', getAllFeedbacks); 

// GET - Get Feedback by ID
router.get('/getsingle-feedback/:id', requireSignIn, getFeedbackById); 

// PUT - Update Feedback by ID
router.put('/update-feedback/:id', requireSignIn, updateFeedbackById);

// DELETE - Delete Feedback by ID
router.delete('/delete-feedback/:id', requireSignIn, deleteFeedbackById);

router.get("/total-feedback", feedbackCountController);


export default router;
