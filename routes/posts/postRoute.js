const { Router } = require("express");
const { createPostCtrl } = require("../../controllers/posts/postCtrl");
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

module.exports = postRoutes;
