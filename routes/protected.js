// routes/protectedRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Blog = require("../models/Blog");

// Protected routes
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// Create a new blog post
router.post("/create", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.userName;

  // Create a new blog post instance
  const newBlogPost = new Blog({
    title,
    content,
    author,
  });

  try {
    // Save the blog post to the database
    await newBlogPost.save();

    // Send a success response
    res.status(200).json({ message: "New blog post created successfully" });
  } catch (err) {
    // Send an error response
    res.status(500).json({ message: err.message });
  }
});

// Update an existing blog post
router.put("/update", verifyToken, async (req, res) => {
  const { currentTitle, newTitle, content } = req.body;
  // console.log("current user is", req.user.userName);

  try {
    // Find the blog post
    const blogPost = await Blog.findOne({ title: currentTitle });

    // Check if the logged in user is the author of the blog post
    if (blogPost.author.toString() !== req.user.userName) {
      console.log("blog post author is", blogPost.author);
      console.log("current user is", req.user.userName);
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog post" });
    }

    // Update the blog post
    const updatedBlogPost = await Blog.findOneAndUpdate(
      { title: currentTitle },
      { title: newTitle || currentTitle, content },
      { new: true, runValidators: true }
    );

    // Send a success response
    res.status(200).json(updatedBlogPost);
  } catch (err) {
    // Send an error response
    res.status(500).json({ message: err.message });
  }
});
// Delete an existing blog post
router.delete("/delete", verifyToken, async (req, res) => {
  const { title } = req.body;

  try {
    // Find the blog post
    const blogPost = await Blog.findOne({ title });

    // Check if the logged in user is the author of the blog post
    if (blogPost.author.toString() !== req.user.userName) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this blog post" });
    }

    // Delete the blog post
    await Blog.findOneAndDelete({ title });

    // Send a success response
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (err) {
    // Send an error response
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
