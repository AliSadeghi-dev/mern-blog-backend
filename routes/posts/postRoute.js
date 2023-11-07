const { Router } = require("express");
const {
  createPostCtrl,
  fetchAllPosts,
  fetchPostCtrl,
  updatePostCtrl,
  removePostCtrl,
  likePostCtrl,
  toggleAddDislikeToPostCtrl
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  PhotoUploadMulter,
  postImageResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = Router();

postRoutes.post(
  "/",
  authMiddleware,
  PhotoUploadMulter.single("image"),
  postImageResize,
  createPostCtrl
);
postRoutes.put("/likes", authMiddleware, likePostCtrl);
postRoutes.put("/dislikes", authMiddleware, toggleAddDislikeToPostCtrl);
postRoutes.get("/", authMiddleware, fetchAllPosts);
postRoutes.get("/:id", authMiddleware, fetchPostCtrl);
postRoutes.put("/:id", authMiddleware, updatePostCtrl);
postRoutes.delete("/:id", authMiddleware, removePostCtrl);


module.exports = postRoutes;
