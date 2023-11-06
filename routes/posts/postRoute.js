const { Router } = require("express");
const {
  createPostCtrl,
  fetchAllPosts,
  fetchPostCtrl
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  PhotoUploadMulter,
  postImageResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = Router();

postRoutes.get("/", authMiddleware, fetchAllPosts);
postRoutes.get("/:id", authMiddleware, fetchPostCtrl);
postRoutes.post(
  "/",
  authMiddleware,
  PhotoUploadMulter.single("image"),
  postImageResize,
  createPostCtrl
);

module.exports = postRoutes;
