const Comment = require("../model/commentModel");

// Add a comment
const addComment = async (req, res) => {
  try {
    const { userId, foodId, text } = req.body;
    const newComment = new Comment({
        userId,
      foodId,
      text,
    });
    await newComment.save();
    res.status(200).send({ message: "Comment Created Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

// Get comments for a specific food product
const getComments = async (req, res) => {
    try {
        const productId = req.params.productId;
        const comments = await Comment.find({foodId: productId})
        .populate("userId", "username photo")
        .sort({createdAt: -1}) // Sort by newest first

        res.json(comments);
    }catch (error) {
        res.status(500).send({ message: "Server Error" });
    }
}

module.exports = { addComment }
