import User from "../models/userModel.js";
import Post from "../models/postModel.js";

export const getAllPosts = async (req, res) => {
  console.log("getAllPosts");
  try {
    const authUser = await User.findById(req.user._id);
    const posts = await Post.find({
      author: { $nin: authUser.blockedBy },
      author: { $nin: authUser.blockedUsers },
    })
    .populate({
      path: "author",
      select: "username displayName profilePicture privateAccount _id",
    })
    .populate({
      path: "parentPost",
      populate: {
        path: "author",
        select: "username displayName _id privateAccount"
      },
      select: "author"
    })
    .sort({ createdAt: -1 });

    const allowedPosts = posts.filter((post) => {
        const author = post.author;
      return (
        author && (
            !author.privateAccount ||
            authUser.following.includes(author._id) ||
            author._id.equals(authUser._id)
        )
         );
      }
    );

    if (allowedPosts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    res.status(200).json(allowedPosts);
  } catch (error) {
    console.log("getAllPosts error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const authUser = await User.findById(req.user._id);
    const posts = await Post.find({ author: { $in: authUser.following } })
    .populate({
      path: "author",
      select: "username displayName profilePicture privateAccount _id",
    })
    .populate({
      path: "parentPost",
      populate: {
        path: "author",
        select: "username displayName"
      },
      select: "author"
    })
    .sort({ createdAt: -1 });
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("getFollowingPosts error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProfilePosts = async (req, res) => {
  try {
    const authUser = await User.findById(req.user._id);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.privateAccount && !authUser.following.includes(user._id) && !authUser._id.equals(user._id)) {
      return res.status(401).json({ message: "Private account" });
    }
    if (user.blockedUsers.includes(authUser._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "username displayName profilePicture privateAccount _id",
    });
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("getProfilePosts error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const { text } = req.body;
    const newPost = new Post({
      author: req.user._id,
      text,
    });
    authUser.posts.push(newPost._id);
    await authUser.save();
    await newPost.save();
    const post = await newPost.populate({
      path: "author",
      select: "username displayName profilePicture _id",
    })
    res.status(201).json(newPost);
  } catch (error) {
    console.log("createPost error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const authUser = await User.findById(req.user._id);
    const post = await Post.findById(req.params.postId).populate({
      path: "author",
      select: "username displayName profilePicture _id privateAccount",
    })
    .populate({
      path: "replies",
      select: "author text createdAt",
      populate: {
        path: "author",
        select: "username displayName profilePicture _id privateAccount",
      }
    })
    .populate({
      path: "parentPost",
      select: "author text createdAt",
      populate: {
        path: "author",
        select: "username displayName profilePicture _id privateAccount",
      }
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (authUser.blockedBy.includes(post.author._id)) {
      return res.status(401).json({ message: "You are blocked" });
    };

    if (post.author.privateAccount && !req.user.following.includes(post.author._id) && post.author._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Private account" });
    }

    post.replies = post.replies.filter((reply) => {
      if (authUser.blockedBy.includes(reply.author._id)) {
        return false;
      }
      return true;
    })

    post.replies = post.replies.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    console.log(post);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "This is not your post" });
    }
    authUser.posts = authUser.posts.filter((_id) => _id.toString() !== req.params.postId);
    const parent = await Post.findById(post.parentPost);
    if (parent) {
      parent.replies = parent.replies.filter((_id) => _id.toString() !== req.params.postId);
      await parent.save();
    }
    const replies = await Post.find({ parentPost: req.params.postId });
    if (replies.length > 0) {
      await Promise.all(
        replies.map(async (reply) => {
          reply.parentPost = null;
          await reply.save();
        })
      )
    };
    await authUser.save();
    await Post.deleteOne({ _id: req.params.postId });
    res.status(200).json(req.params.postId);
  } catch (error) {
    console.log("deletePost error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId ).populate({
      path: "author",
      select: "username displayName profilePicture privateAccount _id parent",
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (authUser.blockedBy.includes(post.author._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    if (
      post.author.privateAccount &&
      !authUser.following.includes(post.author._id)
    ) {
      return res.status(401).json({ message: "Private account" });
    }
    if (post.likes.includes(req.user._id)) {
      return res.status(401).json({ message: "Already liked" });
    }
    post.likes.push(req.user._id);
    authUser.likes.push(post._id);
    await post.save();
    await authUser.save();
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.log("likePost error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(req.user._id)) {
      return res.status(401).json({ message: "Not liked" });
    }
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    authUser.likes = authUser.likes.filter(
      (id) => id.toString() !== req.params.postId
    );
    await post.save();
    await authUser.save();
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.log("unikePost error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const replyToPost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "author",
      select: "username displayName profilePicture privateAccount blockedUsers",
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.blockedUsers.includes(req.user._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    if (
      post.author.privateAccount &&
      !authUser.following.includes(post.author._id) &&
      post.author._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Private account" });
    }
    const { text } = req.body;
    const newPost = new Post({
      author: req.user._id,
      text,
      parentPost: req.params.postId,
    });
    post.replies.push(newPost._id);
    await post.save();
    await newPost.save();
    const returnPost = await newPost.populate({
      path: "author",
      select: "username displayName profilePicture _id",
    })
    res.status(201).json(returnPost);
  } catch (error) {
    console.log("replyToPost error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getReplies = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "author",
      select: "username profilePicture privateAccount blockedUsers replies",
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.blockedUsers.includes(req.user._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    if (
      post.author.privateAccount &&
      !authUser.following.includes(post.author._id)
    ) {
      return res.status(401).json({ message: "Private account" });
    }
    const repliesPromise =  post.replies.map((id) => 
      Post.findById(id).populate({
        path: "author",
        select: "username displayName profilePicture privateAccount blockedUsers",
      }))
      .sort({ createdAt: -1 });

    const replies = await Promise.all(repliesPromise);
    console.log(replies);
    const allowedReplies = replies.filter((reply) => {
      return (
        reply &&
      !reply.author.blockedUsers.includes(req.user._id) &&
      (!reply.author.privateAccount ||
      authUser.following.includes(reply.author._id)));
    })
    if (allowedReplies.length === 0) {
      return res.status(200).json({ message: "No replies found" });
    }
    res.status(200).json(allowedReplies);
  } catch (error) {
    console.log("getReplies error", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getParentPost = async (req, res) => {
  const authUser = await User.findById(req.user._id);
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "author",
      select: "username displayName profilePicture privateAccount blockedUsers",
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.blockedUsers.includes(req.user._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    if (
      post.author.privateAccount &&
      !authUser.following.includes(post.author._id)
    ) {
      return res.status(401).json({ message: "Private account" });
    }
    const parentPost = await Post.findById(post.parentPost).populate({
      path: "author",
      select: "username displayName profilePicture privateAccount blockedUsers",
    })
    if (!parentPost) {
      return res.status(404).json({ message: "Post does not have a parent" });
    }
    if (parentPost.author.blockedUsers.includes(req.user._id)) {
      return res.status(401).json({ message: "You are blocked" });
    }
    if (
      parentPost.author.privateAccount &&
      !authUser.following.includes(parentPost.author._id)
    ) {
      return res.status(401).json({ message: "Private account" });
    }
    res.status(200).json(parentPost);
  } catch (error) {
    console.log("getParentPost error", error.message);
    res.status(500).json({ message: error.message });
  }
};
