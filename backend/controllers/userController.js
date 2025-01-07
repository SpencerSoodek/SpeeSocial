import User from "../models/userModel.js";
import FollowRequest from "../models/followRequestModel.js";

export const profile = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const user = await User.findOne({username: req.params.username}).select("-password, -posts");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const myAccount = authUser._id.equals(user._id);
        const following = authUser.following.includes(user._id);
        const blocked = user.blockedUsers.includes(req.user._id);
        console.log(user);
        return res.status(200).json({
            myAccount: myAccount,
            profile: user,
            following: following,
            privateAccount: user.privateAccount,
            blocked: blocked
        })
    } catch (error) {
        console.log("profile error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const followUser = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (authUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: "User already followed" });
        }
        if (user.blockedUsers.includes(req.user._id)) {
            return res.status(400).json({ message: "You are blocked." });
        }
        if (user.privateAccount) {
            const followRequest = await FollowRequest.findOne({ sender: req.user._id, receiver: req.params.id, status: "pending" });
            if (followRequest) {
                return res.status(400).json({ message: "Follow request already sent" , followStatus: "requested"});
            }
            if (!followRequest) {
                const newFollowRequest = new FollowRequest({
                    sender: req.user._id,
                    receiver: req.params.id
                });
                await newFollowRequest.save();
                return res.status(200).json({ message: "Follow request sent" , followStatus: "followed"});
            }
        }
        user.followers.push(req.user._id);
        authUser.following.push(req.params.id);
        await user.save();
        await authUser.save();
        return res.status(200).json({ message: "User followed" , followStatus: "requested"});
    } catch (error) {
        console.log("followUser error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const authUser = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!authUser.following.includes(req.params.id)) {
            return res.status(400).json({ message: "User not followed" });
        }
        authUser.following = authUser.following.filter((_id) => _id.toString() !== req.params.id);
        user.followers = user.followers.filter((_id) => _id.toString() !== req.user._id.toString());

        console.log("authUser.following after unfollow:", authUser.following);
        console.log("user.followers after unfollow:", user.followers);

        await authUser.save();
        await user.save();
        return res.status(200).json({ message: "User unfollowed" });
    } catch (error) {
        console.log("unfollowUser error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const blockUser = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (authUser.blockedUsers.includes(req.params.id)) {
            return res.status(400).json({ message: "User already blocked" });
        }
        authUser.blockedUsers.push(req.params.id);
        user.blockedBy.push(req.user._id);

        if (authUser.followers.includes(req.params.id)) {
            authUser.followers = authUser.followers.filter((id) => id.toString() !== req.params.id.toString());
        }
        if (user.following.includes(req.user._id)) {
            user.following = user.following.filter((id) => id.toString() !== req.user._id.toString());
        }
        await authUser.save();
        await user.save();
        return res.status(200).json({ message: "User blocked" });
    } catch (error) {
        console.log("blockUser error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const authUser = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!authUser.blockedUsers.includes(req.params.id)) {
            return res.status(400).json({ message: "User is not blocked" });
        }
        authUser.blockedUsers = authUser.blockedUsers.filter((id) => id.toString() !== req.params.id);
        user.blockedBy = user.blockedBy.filter((id) => id.toString() !== req.user._id.toString());
        await authUser.save();
        await user.save();
        return res.status(200).json({ message: "User unblocked" });
    } catch (error) {
        console.log("unblockUser error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const isFollowingUser = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.user._id.equals(req.params.id)) {
            return res.status(200).json({ followingStatus: "me" });
        }
        if (authUser.blockedBy.includes(req.params.id)) {
            return res.status(400).json({ message: "User is blocked" });
        }
        if (authUser.following.includes(req.params.id)) {
            return res.status(200).json({ followingStatus: "following" });
        }
        const followRequest = await FollowRequest.findOne({ sender: req.user._id, receiver: req.params.id, status: "pending" });
        if (followRequest) {
            return res.status(200).json({ followingStatus: "requested" });
        }
        return res.status(200).json({ followingStatus: "not following" });
    }
    catch (error) {
        console.log("isFollowingUser error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const blockedUsers = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id).populate({
            path: "blockedUsers",
            select: "username displayName profilePicture _id",
        });
        return res.status(200).json(authUser.blockedUsers);
    }
    catch (error) {
        console.log("blockedUsers error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const followers = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id)
        const user = await User.findById(req.params.id).populate({
            path: "followers",
            select: "username displayName profilePicture _id",
            populate: {
                path: "followers",
                select: "username displayName profilePicture _id",
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followers = user.followers;
        followers.map(follower => {
            if (authUser.blockedBy.includes(follower._id)) {
                follower.amIBlocked = true;
            } else {
                follower.amIBlocked = false;
            }
            if (authUser.following.includes(follower._id)) {
                follower.amIFollowing = true;
            } else {
                follower.amIFollowing = false;
            }
        })
        return res.status(200).json(followers);
    }
    catch (error) {
        console.log("followers error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const followingUsers = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id)
        const user = await User.findById(req.params.id).populate({
            path: "following",
            select: "username displayName profilePicture _id",
            populate: {
                path: "following",
                select: "username displayName profilePicture _id",
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const following = user.following;
        following.map(follower => {
            if (authUser.blockedBy.includes(follower._id)) {
                follower.amIBlocked = true;
            } else {
                follower.amIBlocked = false;
            }
            if (authUser.following.includes(follower._id)) {
                follower.amIFollowing = true;
            } else {
                follower.amIFollowing = false;
            }
        })
        return res.status(200).json(following);
    }
    catch (error) {
        console.log("followingUsers error", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const query = req.params.query;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ message: "Invalid search query" });
        }

        const users = await User.find({ 
            username: { $regex: new RegExp(query, "i") } 
        }).select("username displayName profilePicture _id");

        // Filter out users blocked by the authenticated user
        const filteredUsers = users.filter(user => !authUser.blockedBy.includes(user._id.toString()));

        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("searchUsers error", error.message);
        res.status(500).json({ message: error.message });
    }
};
