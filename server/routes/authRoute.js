import express from "express";
import {registerController, loginController, forgotPasswordController, testController, updateProfileController, userCountController, getAllUsersController, getSubscriptionByUser, getAllSubscriptionByUser, getAllFeedbacksByUser } from "../controlllers/authController.js";

// authMiddleware.js

import JWT from "jsonwebtoken";

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

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
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




const router = express.Router();


// register
router.post("/register", registerController);

// login
router.post("/login", loginController);


// user auth protect routes || dashboard
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).json({
        "ok": true,
        "message": "User authentication successful"
    }
    );
});

// admin auth protect routes || admin dashboard
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({
        "ok": true,
        "message": "Admin authentication successful"
    }
    );
});

// jwt || get method test

router.get("/test", requireSignIn, isAdmin,  testController);

// forgot-password
router.post("/forgot-password", forgotPasswordController);
// update profile
router.put("/user-profile", requireSignIn, updateProfileController);


// count profile
router.get("/total-user", userCountController);

// get users
router.get("/get-all-users", getAllUsersController);

router.get("/get-user-plan", requireSignIn, getSubscriptionByUser);

router.get("/get-all-user-plan", requireSignIn, getAllSubscriptionByUser);

router.get("/get-all-user-feedback", requireSignIn, getAllFeedbacksByUser);




export default router;



