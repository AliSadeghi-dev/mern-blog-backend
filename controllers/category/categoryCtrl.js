const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");

//create a new category
const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const user = req.user._id;
  try {
    const category = await Category.create({
      user,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//fetch all categories
const fetchAllCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

//fetch category by id
const fetchCategoryById = expressAsyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//update category
const updateCategory = expressAsyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        user: req.user._id,
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//delete category

const deleteCategory = expressAsyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  try {
    await Category.findByIdAndDelete(categoryId);
    res.json("category successfully deleted. ");
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategoryCtrl,
  fetchAllCategoriesCtrl,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
};
