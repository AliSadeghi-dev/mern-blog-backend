const express = require("express");
const {
  userRegisterCtrl,
  loginUserController,
  fetchUsers,
  deleteUserCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authMiddleware, fetchUsers);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.put("/password/:id", authMiddleware, updatePasswordCtrl);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", fetchUserCtrl);

module.exports = userRoutes;
