const { Router } = require("express");
const {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const categoryRoutes = Router();

categoryRoutes.post("/", authMiddleware, createCategoryCtrl);
categoryRoutes.get("/", authMiddleware, fetchAllCategoriesCtrl);
categoryRoutes.get("/:id", authMiddleware, fetchCategoryById);
categoryRoutes.put("/:id", authMiddleware, updateCategory);
categoryRoutes.delete("/:id", authMiddleware, deleteCategory);

module.exports = categoryRoutes;
