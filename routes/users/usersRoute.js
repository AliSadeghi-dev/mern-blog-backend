const express = require("express");
const {
  userRegisterCtrl,
  loginUserController,
} = require("../../controllers/users/usersCtrl");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserController);

module.exports = userRoutes;
