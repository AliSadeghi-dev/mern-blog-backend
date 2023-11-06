const express = require("express");
const {
  userRegisterCtrl,
  loginUserController,
  fetchUsers,
  deleteUserCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  followingUserCtrl,
  unFollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationCode,
  profilePhotoUpload,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  profilePhotoUploadMulter,
  profilePhotoResize
} = require("../../middlewares/uploads/profilePhotoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authMiddleware, fetchUsers);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.put(
  "/profilephoto-upload",
  authMiddleware,
  profilePhotoUploadMulter.single('image'),
  profilePhotoResize,
  profilePhotoUpload
);
userRoutes.post("/send-email", generateVerificationCode);
userRoutes.put("/unfollow", authMiddleware, unFollowUserCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.put("/password/:id", authMiddleware, updatePasswordCtrl);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", fetchUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);

module.exports = userRoutes;
