import express from "express";
// import {isAdmin, requireSignIn} from "../Middlewares/authMiddleware.js"
import JWT from "jsonwebtoken";
import {createplanController, updateplanController, deleteplanController, getAllPlanController, getPlanController, planCountController} from "../controlllers/PlanCategoryController.js"
const router = express.Router();

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

// plan - choose
router.post("/create-plan", requireSignIn, isAdmin, createplanController);

router.put("/update-plan/:planid", requireSignIn, isAdmin, updateplanController);

router.delete("/delete-plan/:planid", requireSignIn, isAdmin, deleteplanController);

router.get("/getall-plan", getAllPlanController);

router.get("/get-plan/:planid", getPlanController);

router.get("/total-plan", planCountController);


export default router;

