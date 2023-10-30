const expressAsyncHandler = require("express-async-handler");

const User = require("../../model/user/User");

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
    res.json(userFound);
  } else {
    res.status(401);
    throw new Error(`Invalid Login Credentials. `);
  }
});

module.exports = {
  userRegisterCtrl,
  loginUserController,
};
