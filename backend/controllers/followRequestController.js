import FollowRequest from "../models/followRequestModel.js";
import User from "../models/userModel.js";

export const myFollowRequests = async (req, res) => {
    try {
        const followRequests = await FollowRequest.find({ receiver: req.user._id , status: "pending" }).populate("sender", "_id username profilePicture");
        if (followRequests.length === 0) {
            returnres.status(200).json({ message: "No follow requests" });
        }
        return res.status(200).json(followRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const acceptFollowRequest = async (req, res) => {
    try {
        const authUser = await User.findById(req.user._id);
        const followRequest = await FollowRequest.findById(req.params.id);
        if (!followRequest) {
            return res.status(404).json({ message: "Follow request not found" });
        }
        if (followRequest.status !== "pending") {
            return res.status(400).json({ message: "Follow request is not pending" });
        }
        const sender = await User.findById(followRequest.sender);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }
        if (authUser.followers.includes(sender._id) || sender.following.includes(authUser._id)) {
            return res.status(400).json({ message: "User already follows you" });
        }
        authUser.followers.push(sender._id);
        sender.following.push(authUser._id);
        followRequest.status = "accepted";
        await authUser.save();
        await sender.save();
        await followRequest.save();
        res.status(200).json({ message: "Follow request accepted" });
    } catch (error) {
        console.log("acceptFollowRequest error", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export const declineFollowRequest = async (req, res) => {
    try {
        const followRequest = await FollowRequest.findById(req.params.id);
        if (!followRequest) {
            return res.status(404).json({ message: "Follow request not found" });
        }
        if (followRequest.status !== "pending") {
            return res.status(400).json({ message: "Follow request is not pending" });
        }
        followRequest.status = "declined";
        await followRequest.save();
        res.status(200).json({ message: "Follow request declined" });
    } catch (error) {
        console.log("declineFollowRequest error", error.message);
        return res.status(500).json({ message: error.message });
    }
}
