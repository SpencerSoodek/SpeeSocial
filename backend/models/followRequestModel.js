import mongoose from "mongoose";

const followRequestModel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    }
}, { timestamps: true });

const FollowRequest = mongoose.model("FollowRequest", followRequestModel);
export default FollowRequest;