const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Blog = require("../models/Blog");

// GET /blog/:title
router.get("/blog/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const blog = await Blog.findOne({ title: title });
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Something else went wrong" });
  }
});

module.exports = router;
