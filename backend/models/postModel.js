import mongoose from "mongoose";

const postModel = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    parentPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
}, { timestamps: true });

const Post = mongoose.model("Post", postModel);
export default Post;