const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true 
}
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
