const { Router } = require("express");
const router = Router();

const upload = require("../middlewares/multer");

const {
  handleAddNewPost,
  handleGetAllPosts,
  handleGetUserPosts,
  handleLikePost,
  handleAddComment,
  handleGetCommentsOfPost,
  handleDeletePost,
  handleBookmark,
} = require("../controllers/postController");

const auth = require("../middlewares/authMiddleware");

router.post("/add", auth, upload.single("image"), handleAddNewPost);
router.get("/all", handleGetAllPosts);
router.get("/user-posts/:id", auth, handleGetUserPosts);
router.post("/like/:id", auth, handleLikePost);
router.post("/comment/:id", auth, handleAddComment);
router.post("/comment/all/:id", auth, handleGetCommentsOfPost);
router.delete("/delete/:id", auth, handleDeletePost);
router.post("/bookmark/:id", auth, handleBookmark);

module.exports = router;
