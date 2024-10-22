import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { myFollowRequests, acceptFollowRequest, declineFollowRequest } from "../controllers/followRequestController.js";

const router = express.Router();

router.get("/", protectRoute, myFollowRequests);
router.post("/accept/:id", protectRoute, acceptFollowRequest);
router.post("/decline/:id", protectRoute, declineFollowRequest);

export default router;