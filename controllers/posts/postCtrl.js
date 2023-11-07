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
    const post = await Post.findById({ _id: id })
      .populate("user")
      .populate("disLikes")
      .populate("likes");
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
    const deletedPost = await Post.findByIdAndDelete(id);
    res.json(deletedPost);
  } catch (error) {
    res.json(error);
  }
});

//like post
const likePostCtrl = expressAsyncHandler(async (req, res) => {
  //find the post to like
  const loginUserId = req?.user?._id;
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2 find the login user
  //3 find if this user has liked this post
  const isLiked = post?.isLiked;
  //4 check if this user has dislike this post
  const alreadyDisliked = post?.disLikes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //5 remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
  //Toggle

  //Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

//dislike
const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  //1.Find the post to be disliked
  const loginUserId = req?.user?._id;
  const { postId } = req?.body;
  const post = await Post.findById(postId);
  //find the login user
  //check if the user has already dislikes
  const isDisliked = post?.isDisLiked;
  //check if the user already likes this post
  const isAlreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );

  //Remove this user from likes array if exists
  if (isAlreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }

  //toggling
  //remove this user from likes if already disliked
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchAllPosts,
  fetchPostCtrl,
  updatePostCtrl,
  removePostCtrl,
  likePostCtrl,
  toggleAddDislikeToPostCtrl,
};
