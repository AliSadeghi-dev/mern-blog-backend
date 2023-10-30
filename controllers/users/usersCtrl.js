const User = require("../../model/user/User");

//Register User
const userRegisterCtrl = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  userRegisterCtrl,
};
