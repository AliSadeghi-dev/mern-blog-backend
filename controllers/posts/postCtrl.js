const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");

const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongodbId");
const User = require("../../model/user/User");
const cloudinaryUploadImage = require("../../utils/cloudinary");

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
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
};
