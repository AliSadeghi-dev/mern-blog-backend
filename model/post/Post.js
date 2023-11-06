const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Post Category is required."],
      default: "All",
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    description: {
      type: String,
      required: [true, "Post Description is required"],
    },
    image: {
      type: String,
      default:
        "https://imgs.search.brave.com/PflmIEQ2RNqlCzZnOalks1gL8ScBgTZyIPvyHNMQvME/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zMy5l/dS13ZXN0LTMuYW1h/em9uYXdzLmNvbS9h/bmRyb2lkZXR2b3Vz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAxOS8wOS8xMDEy/MDkxNC9waWN0dXJl/LWluLXBpY3R1cmUt/Y29tbWVudC1hY3Rp/dmVyLW1vZGUuanBn",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
