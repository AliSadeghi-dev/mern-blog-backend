const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
