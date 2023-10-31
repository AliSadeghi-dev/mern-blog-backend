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

module.exports = {
  userRegisterCtrl,
  loginUserController,
  fetchUsers,
  deleteUserCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
};
