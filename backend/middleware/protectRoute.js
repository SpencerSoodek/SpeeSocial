import User from "../models/userModel.js";
import jwt  from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: "Not authorized"});
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({message: "Invalid Token"});
        }
        const user = await User.findById(verified.userID).select("-password");
        if (!user) {
            return res.status(401).json({message: "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("protectRoute error", error.message);
        res.status(401).json({message: "Not authorized"});
    }
}