const express = require("express");
const {
  userRegisterCtrl,
  loginUserController,
  fetchUsers,
  deleteUserCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authMiddleware, fetchUsers);
userRoutes.get("/profile/:id",authMiddleware, userProfileCtrl);
userRoutes.delete("/:id",authMiddleware, deleteUserCtrl);
userRoutes.get("/:id", authMiddleware, fetchUserCtrl);
userRoutes.put('/:id',authMiddleware,updateUserCtrl)

module.exports = userRoutes;
