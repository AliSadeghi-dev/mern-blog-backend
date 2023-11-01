const expressAsyncHandler = require("express-async-handler");

const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const validateMongoDbId = require("../../utils/validateMongodbId");

//Register User
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  //Check if user exists
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists.");
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//Login User

const loginUserController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check if user exists
  const userFound = await User.findOne({ email });
  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      profilePhoto: userFound.profilePhoto,
      isAdmin: userFound.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error(`Invalid Login Credentials. `);
  }
});

//users
const fetchUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//Delete User

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

//fetch one User
const fetchUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const foundUser = await User.findById(id);
    res.json(foundUser);
  } catch (error) {
    res.json(error);
  }
});

//User Profile

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const foundUser = await User.findById(id);
    res.json(foundUser);
  } catch (error) {
    res.json(error);
  }
});

//Update profile
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongoDbId(_id);
  try {
    const foundUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(foundUser);
  } catch (error) {
    res.json(error);
  }
});

//Update password
const updatePasswordCtrl = expressAsyncHandler(async (req, res) => {
  console.log("ali");
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  console.log("password: " + password);
  validateMongoDbId(_id);
  //Find user by _id
  const user = await User.findById(_id);
  console.log("user: " + user);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  res.json(user);
});

//Following
const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user._id;
  validateMongoDbId(followId);
  //Find the target user and check if the login userId exists
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );
  if (alreadyFollowing) {
    throw new Error("You have already followed this user.");
  }

  //1-Find the User you want to follow and update its followers field
  await User.findByIdAndUpdate(
    followId,
    {
      $push: {
        followers: loginUserId,
      },
      isFollowing: true,
    },
    {
      new: true,
    }
  );

  //2-update the login user following filed
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: {
        following: followId,
      },
    },
    {
      new: true,
    }
  );
  res.json("You have successfully follow this user.");
});

//UnFollow
const unFollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unFollowId } = req.body;
  const loginUserId = req.user._id;
  validateMongoDbId(unFollowId);

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: {
        followers: loginUserId,
      },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: {
        following: unFollowId,
      },
    },
    {
      new: true,
    }
  );
  res.json("You have successfully unfollow this user");
});

module.exports = {
  userRegisterCtrl,
  loginUserController,
  fetchUsers,
  deleteUserCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  followingUserCtrl,
  unFollowUserCtrl,
};
