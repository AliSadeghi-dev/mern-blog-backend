const { Router } = require("express");
const {
  createPostCtrl,
  fetchAllPosts,
  fetchPostCtrl,
  updatePostCtrl,
  removePostCtrl,
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  PhotoUploadMulter,
  postImageResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = Router();

postRoutes.get("/", authMiddleware, fetchAllPosts);
postRoutes.get("/:id", authMiddleware, fetchPostCtrl);
postRoutes.put("/:id", authMiddleware, updatePostCtrl);
postRoutes.delete("/:id", authMiddleware, removePostCtrl);
postRoutes.post(
  "/",
  authMiddleware,
  PhotoUploadMulter.single("image"),
  postImageResize,
  createPostCtrl
);

module.exports = postRoutes;
