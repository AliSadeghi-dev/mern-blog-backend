const { Router } = require("express");

const {
  createCommentCtrl,
  fetchComments,
  fetchSingleComment,
  updateComment,
  deleteComment,
} = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const commentRoutes = Router();

commentRoutes.post("/", authMiddleware, createCommentCtrl);
commentRoutes.get("/", authMiddleware, fetchComments);
commentRoutes.get("/:id", authMiddleware, fetchSingleComment);
commentRoutes.put("/:id", authMiddleware, updateComment);
commentRoutes.delete("/:id", authMiddleware, deleteComment);

module.exports = commentRoutes;
