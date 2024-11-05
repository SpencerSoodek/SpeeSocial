import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { profile, followUser, unfollowUser, blockUser, unblockUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, profile);
router.post("/follow/:id", protectRoute, followUser);
router.post("/unfollow/:id", protectRoute, unfollowUser);
router.post("/block/:id", protectRoute, blockUser);
router.post("/unblock/:id", protectRoute, unblockUser);

export default router;