const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");

//create comment
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  //1.Get the user
  const user = req.user;
  //2.Get the post id
  const { postId, description } = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//fetch all comments
const fetchComments = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

// fetch comment by id
const fetchSingleComment = expressAsyncHandler(async (req, res) => {
  const commentId = req?.params?.id;
  try {
    const comment = await Comment.findById(commentId);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//update comment
const updateComment = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const commentId = req?.params?.id;
  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        post: req?.body?.postId,
        user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//delete comment
const deleteComment = expressAsyncHandler(async (req, res) => {
  const commentId = req.params.id;
  try {
    await Comment.findByIdAndDelete(commentId);
    res.json("Comment successfully deleted.");
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchComments,
  fetchSingleComment,
  updateComment,
  deleteComment,
};
