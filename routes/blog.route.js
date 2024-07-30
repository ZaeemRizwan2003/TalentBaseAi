const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.models'); // Adjust the path as necessary

// Create a new blog post
router.post('/blogs', async (req, res) => {
  const {
      title,
      category,
      body,
      subHeadings,
      tags,
      keywords,
      comments
  } = req.body;

  try {
      // Get the user ID from the session
      const authorId = req.session._id; // Assuming _id is stored in session

      // Validate if the user ID is available in the session
      if (!authorId) {
          return res.status(403).json({ message: "Unauthorized. No user found in session." });
      }

      // Create a new blog post
      const newBlog = new Blog({
          title,
          category,
          body,
          subHeadings,
          tags,
          keywords,
          authorId,
          comments
      });

      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
  } catch (error) {
      res.status(500).json({
          message: error.message
      });
  }
});

//Get a single blog based on id of blog 
router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                message: 'Blog post not found'
            });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//Get all blogs of a user
router.get('/blogs/author/:authorId', async (req, res) => {
    try {
      const blogs = await Blog.find({ authorId: req.params.authorId });
  
      if (blogs.length === 0) {
        return res.status(404).json({ message: 'No blog posts found for this author' });
      }
  
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Update Blogs
router.put('/blogs/:id', async (req, res) => {
    const {
      title,
      category,
      body,
      subHeadings,
      tags,
      keywords,
      comments
    } = req.body;
  
    try {
      const updatedFields = {};
  
      if (title) updatedFields.title = title;
      if (category) updatedFields.category = category;
      if (body) updatedFields.body = body;
      if (subHeadings) updatedFields.subHeadings = subHeadings;
      if (tags) updatedFields.tags = tags;
      if (keywords) updatedFields.keywords = keywords;
      if (comments) updatedFields.comments = comments;
  
      updatedFields.updatedAt = Date.now();
  
      const blog = await Blog.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true, runValidators: true });
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Delete Posts
router.delete('/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
// search blogs based on title
router.post('/blogs/search', async (req, res) => {
  console.log('Received search request with title:', req.query.title);
  try {
    // Check if title is an array or a single string
    const title = req.query.title;

    if (!title) {
      return res.status(400).json({ message: 'Title query parameter is required' });
    }

    // Use regular expression for partial matching
    const blogs = await Blog.find({ title: { $regex: title, $options: 'i' } });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;