import express from "express";
import { signup, login, logout, updateUser, currUser } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", protectRoute, updateUser);
router.get("/current", protectRoute, currUser);

export default router;