const { Router } = require("express");
const {
  createPostCtrl,
  fetchAllPosts,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  PhotoUploadMulter,
  postImageResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = Router();

postRoutes.get("/", authMiddleware, fetchAllPosts);
postRoutes.post(
  "/",
  authMiddleware,
  PhotoUploadMulter.single("image"),
  postImageResize,
  createPostCtrl
);

module.exports = postRoutes;
