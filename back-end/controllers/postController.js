const Post = require("../models/postModel");
const cloudinary = require("../configuration/cloudinary");
const getDataUri = require("../utils/datauri");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const { getReceiverSocketID, io } = require("../socket/socket");

const handleAddNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ msg: "please select an image!" });
    }

    const fileuri = getDataUri(image);
    const cloudResponse = await cloudinary.uploader.upload(fileuri);

    const newPost = await Post.create({
      image: cloudResponse.secure_url,
      authorID: req.user._id,
      caption,
      time: new Date().getTime(),
    });

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { posts: newPost._id } }
    );

    const post = await Post.findOne({ _id: newPost._id })
      .populate("authorID", "username profilePicture")
      .populate("comments");

    return res.status(201).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetAllPosts = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("authorID", "username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetUserPosts = async (req, res) => {
  try {
    const userID = req.params.id;
    const posts = await Post.find({ authorID: userID })
      .sort({ createdAt: -1 })
      .populate("authorID", "username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({ posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleDeletePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.user._id;

    await Promise.all([
      Post.findOneAndDelete({ _id: postID }),
      User.findOneAndUpdate({ _id: userID }, { $pull: { posts: postID } }),
      Comment.deleteMany({ post: postID }),
    ]);

    return res.status(200).json({ msg: "post deleted successfully!" });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleLikePost = async (req, res) => {
  try {
    const userID = req.user._id;
    const postID = req.params.id;

    const post = await Post.findOne({ _id: postID });

    // real time notification using socket.io
    const user = await User.findById(userID);
    const postOwnerID = post.authorID.toString();

    const notificationReceiverSocketID = getReceiverSocketID(postOwnerID);

    const notification = {
      postImage: post.image,
      postID,
      userID,
      profilePicture: user.profilePicture,
      username: user.username,
    };

    if (post.likes.includes(userID)) {
      await Post.updateOne({ _id: postID }, { $pull: { likes: userID } });

      if (postOwnerID != userID) {
        notification.type = "dislike";

        io.to(notificationReceiverSocketID).emit("notification", notification);
      }

      return res.status(200).json({ msg: "Disliked Successfully!" });
    } else {
      await Post.updateOne({ _id: postID }, { $addToSet: { likes: userID } });

      if (postOwnerID != userID) {
        notification.type = "like";

        io.to(notificationReceiverSocketID).emit("notification", notification);
      }
      return res.status(200).json({ msg: "Liked Successfully!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleAddComment = async (req, res) => {
  try {
    const userID = req.user._id;
    const postID = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "enter a comment!" });
    }

    const newComment = await Comment.create({
      text,
      author: userID,
      post: postID,
    });

    await Post.findOneAndUpdate(
      { _id: postID },
      { $push: { comments: newComment._id } }
    );

    const comment = await Comment.findOne({ _id: newComment._id }).populate(
      "author",
      "username profilePicture"
    );

    const post = await Post.findById(postID);
    const user = await User.findById(userID);

    const notification = {
      type: "comment",
      text: text,
      postImage: post.image,
      postID,
      userID,
      profilePicture: user.profilePicture,
      username: user.username,
    };

    const notificationReceiverSocketID = getReceiverSocketID(post.authorID);

    if (notificationReceiverSocketID) {
      io.to(notificationReceiverSocketID).emit("notification", notification);
    }

    return res.status(201).json({ comment });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetCommentsOfPost = async (req, res) => {
  try {
    const postID = req.params.id;
    const comments = await Comment.find({ post: postID })
      .sort({
        createdAt: -1,
      })
      .populate("author")
      .select("profilePicture, username");

    if (comments.length == 0) {
      return res.status(400).json({ msg: "not comments yet!" });
    }

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleBookmark = async (req, res) => {
  ``;
  try {
    const postID = req.params.id;
    const userID = req.user._id;

    const user = await User.findOne({ _id: userID });

    if (user.bookmarks.includes(postID)) {
      await User.updateOne({ _id: userID }, { $pull: { bookmarks: postID } });

      return res.status(200).json({ msg: "post unbookmarked!" });
    } else {
      await User.updateOne(
        { _id: userID },
        { $addToSet: { bookmarks: postID } }
      );

      return res.status(200).json({ msg: "post bookmarked!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

module.exports = {
  handleAddNewPost,
  handleGetAllPosts,
  handleGetUserPosts,
  handleLikePost,
  handleDeletePost,
  handleAddComment,
  handleGetCommentsOfPost,
  handleBookmark,
};
