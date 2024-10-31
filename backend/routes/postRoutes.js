import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, likePost, unlikePost, replyToPost, getReplies, getParentPost, getFollowingPosts, getProfilePosts, getAllPosts, getPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/profile/:id", protectRoute, getProfilePosts);

router.get("/getPost/:postId", protectRoute, getPost);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:postId", protectRoute, deletePost);
router.post("/like/:postId", protectRoute, likePost);
router.post("/unlike/:postId", protectRoute, unlikePost);
router.post("/reply/:postId", protectRoute, replyToPost);
router.get("/replies/:postId", protectRoute, getReplies);
router.get("/parent/:postId", protectRoute, getParentPost);

export default router;