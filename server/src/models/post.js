const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_1: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);

postSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
postSchema.set("toJSON", { virtuals: true });

module.exports = Post;
