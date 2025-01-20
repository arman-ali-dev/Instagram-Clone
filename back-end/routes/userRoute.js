const { Router } = require("express");
const auth = require("../middlewares/authMiddleware");

const {
  handleUserRegister,
  handleUserLogin,
  handleGetProfile,
  handleEditProfile,
  handleGetSuggestedUsers,
  handleFollowAndUnFollow,
  handleUserLogout,
} = require("../controllers/userController");
const upload = require("../middlewares/multer");
const router = Router();

router.post("/register", handleUserRegister);
router.post("/login", handleUserLogin);
router.get("/logout", auth, handleUserLogout);

router.get("/profile/:id", auth, handleGetProfile);

router.patch(
  "/edit-profile",
  auth,
  upload.single("profilePicture"),
  handleEditProfile
);

router.get("/suggested-users", auth, handleGetSuggestedUsers);

router.post("/follow/:id", auth, handleFollowAndUnFollow);

module.exports = router;
