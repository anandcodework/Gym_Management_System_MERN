import express from "express";
// import {isAdmin, requireSignIn} from "../Middlewares/authMiddleware.js";
import {createSubscriptionPlanController, updateSubscriptionController, deleteSubscriptionController, getAllSubscriptionsController, getSubscriptionController, subscriptionCountController} from "../controlllers/subscriptionController.js"



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






const router = express.Router();

// plan - choose
router.post("/create-subscription", requireSignIn, createSubscriptionPlanController);

router.put("/update-subscription/:id", requireSignIn, updateSubscriptionController);

router.delete("/delete-subscription/:id", requireSignIn, deleteSubscriptionController);

router.get("/getall-subscription", requireSignIn, getAllSubscriptionsController);

router.get("/get-subscription/:id", requireSignIn, getSubscriptionController);

router.get("/total-subscription", subscriptionCountController);

export default router;

