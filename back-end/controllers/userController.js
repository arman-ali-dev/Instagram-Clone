const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const cloudinary = require("../configuration/cloudinary");
const getDataURI = require("../utils/datauri");
const { io, getReceiverSocketID } = require("../socket/socket");

const handleUserRegister = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ msg: "all fields are required!" });
  }

  if (password.length < 5) {
    return res
      .status(400)
      .json({ msg: "password must be at least 5 characters long!" });
  }

  const usernameExists = await User.findOne({ username });

  if (usernameExists) {
    return res.status(400).json({ msg: "username is already exists!" });
  }

  if (username.includes(" ")) {
    return res.status(400).json({ msg: "username must not contain spaces!" });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ msg: "user is already exists!" });
  }

  try {
    const newUser = await User.create({
      fullname,
      username,
      email,
      password,
    });

    const token = newUser.generateToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        fullname: newUser.fullname,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
        gender: newUser.gender,
        posts: newUser.posts,
        followers: newUser.followers,
        following: newUser.following,
        bookmarks: newUser.bookmarks,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "all fields are required!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ msg: "user does not exists!" });
  }

  const isPassMatch = await bcryptjs.compare(password, user.password);

  if (!isPassMatch) {
    return res.status(401).json({ msg: "invalid password!" });
  }

  const token = user.generateToken();
  res.cookie("token", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({
    user: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      bookmarks: user.bookmarks,
    },
    token,
  });
};

const handleUserLogout = (req, res) => {
  try {
    res.clearCookie("session");

    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const handleGetProfile = async (req, res) => {
  const userID = req.params.id;
  const user = await User.findById(userID);

  return res.status(200).json({ user });
};

const handleEditProfile = async (req, res) => {
  try {
    const userID = req.user._id;
    const { fullname, username, gender, bio, removeProfilePicture } = req.body;
    console.log("removeProfilePicture", removeProfilePicture);

    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileuri = getDataURI(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileuri);
    }

    const user = await User.findOne({ _id: userID }).select("-password");

    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (removeProfilePicture) {
      user.profilePicture =
        "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg";
    }
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetSuggestedUsers = async (req, res) => {
  const userID = req.user?._id;
  const users = await User.find({ _id: { $ne: userID } }).select("-password");

  if (users.length === 0) {
    return res.status(400).json({ msg: "no users!" });
  }

  return res.status(200).json({ users });
};

const handleFollowAndUnFollow = async (req, res) => {
  const userID = req.user._id;
  const targetUserID = req.params.id;

  const user = await User.findOne({ _id: userID });
  const targetUser = await User.findOne({ _id: targetUserID });

  if (!targetUser) {
    return res.status(404).json({ msg: "user not found!" });
  }

  const receiverSocketID = getReceiverSocketID(targetUserID);

  const notification = {
    userID,
    targetUserID,
    profilePicture: user.profilePicture,
    username: user.username,
  };

  if (user.following.includes(targetUserID)) {
    await User.updateOne(
      { _id: userID },
      { $pull: { following: targetUserID } }
    );
    await User.updateOne(
      { _id: targetUserID },
      { $pull: { followers: userID } }
    );

    notification.type = "unfollow";
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("notification", notification);
    }

    return res.status(200).json({ msg: "unfollow successfully!" });
  } else {
    await User.updateOne(
      { _id: userID },
      { $push: { following: targetUserID } }
    );
    await User.updateOne(
      { _id: targetUserID },
      { $push: { followers: userID } }
    );

    notification.type = "follow";
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("notification", notification);
    }

    return res.status(200).json({ msg: "follow successfully!" });
  }
};

module.exports = {
  handleUserRegister,
  handleUserLogin,
  handleGetProfile,
  handleEditProfile,
  handleGetSuggestedUsers,
  handleFollowAndUnFollow,
  handleUserLogout,
};
