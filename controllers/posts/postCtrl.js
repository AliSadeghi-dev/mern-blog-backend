const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");

const Post = require("../../model/post/Post");
const validateMongoDbId = require("../../utils/validateMongodbId");
const User = require("../../model/user/User");

const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(req?.body?.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req?.body?.title, req?.body?.description);

  //Block user
  if (isProfane) {
    const user = await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked."
    );
  }

  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
};
