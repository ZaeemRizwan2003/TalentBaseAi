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
        authorId,
        comments
    } = req.body;

    try {
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


module.exports = router;