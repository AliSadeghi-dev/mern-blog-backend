const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const fs = require("fs");

const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongodbId");
const User = require("../../model/user/User");
const cloudinaryUploadImage = require("../../utils/cloudinary");

//create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req?.body?.title, req?.body?.description);

  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked."
    );
  }
  //Get the path to img
  const localPath = `public/images/posts/${req.file?.filename}`;
  //upload to cloudinary
  const imgUpload = await cloudinaryUploadImage(localPath);
  //Block user
  try {
    const post = await Post.create({
      ...req.body,
      image: imgUpload?.url,
      user: _id,
    });
    res.json(post);
    //remove uploaded image
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

//fetch All
const fetchAllPosts = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

//fetch single post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id }).populate("user");
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//update post

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//delete post

const removePostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndRemove(id);
    res.json(deletedPost);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchAllPosts,
  fetchPostCtrl,
  updatePostCtrl,
  removePostCtrl,
};
