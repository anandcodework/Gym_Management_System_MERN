import express from "express";
import {isAdmin} from "../Middlewares/authMiddleware.js";
import {requireSignIn} from "../Middlewares/authMiddleware.js";
import {registerController, loginController, forgotPasswordController, testController, updateProfileController, userCountController, getAllUsersController, getSubscriptionByUser, getAllSubscriptionByUser, getAllFeedbacksByUser } from "../controlllers/authController.js";

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



