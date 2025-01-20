const User = require("../models/userModel.js");
const JWT = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // const token =
  //   req.headers.authorization && req.headers?.authorization.split(" ")[1];

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: "Token is required" });
  }

  try {
    const decoded = JWT.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id: decoded._id }).select("-password");

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid" });
  }
};

module.exports = auth;
