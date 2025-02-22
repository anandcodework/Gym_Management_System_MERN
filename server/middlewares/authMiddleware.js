// authMiddleware.js

import JWT from "jsonwebtoken";
import Subscription from "../models/Subscription.js";

// Middleware to check if user is signed in
export const requireSignIn = async (req, res, next) => {
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

// Middleware to check if user is an admin
export const isAdmin = async (req, res, next) => {
    try {
        console.log("User Role:", req.user.role);
        if (req.user.role !== 1) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }
        next();
    } catch (error) {
        console.log("Admin Middleware Error:", error);
        res.status(401).json({
            success: false,
            error,
            message: "Error in admin middleware"
        });
    }
};

// Middleware to check if user is subscribed
export const isSubscribed = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const subscription = await Subscription.findOne({ user: userId });
        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "You need an active subscription to perform this action",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default { requireSignIn, isAdmin, isSubscribed };